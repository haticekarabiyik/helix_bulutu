#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String};

const TTL_THRESHOLD: u32 = 100;
const TTL_EXTEND_TO: u32 = 518_400;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    GradeCount(Address),
    ScheduleCount(Address),
    CalculationCount(Address),
    Grade(Address, u32),
    Schedule(Address, u32),
    Calculation(Address, u32),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GradeRecord {
    pub course: String,
    pub score: u32,
    pub term: String,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ScheduleRecord {
    pub course: String,
    pub day: String,
    pub start_time: String,
    pub end_time: String,
    pub location: String,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CalculationRecord {
    pub formula: String,
    pub input_hash: String,
    pub result: String,
    pub created_at: u64,
}

#[contract]
pub struct AcademicRecordsContract;

#[contractimpl]
impl AcademicRecordsContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }

        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
    }

    pub fn add_grade(env: Env, owner: Address, course: String, score: u32, term: String) -> u32 {
        owner.require_auth();
        if score > 100 {
            panic!("score must be between 0 and 100");
        }

        let index = next_index(&env, DataKey::GradeCount(owner.clone()));
        let record = GradeRecord {
            course,
            score,
            term,
            created_at: env.ledger().timestamp(),
        };
        let key = DataKey::Grade(owner.clone(), index);

        env.storage().persistent().set(&key, &record);
        bump_persistent(&env, &key);
        env.events().publish((symbol_short!("grade"), owner), index);
        index
    }

    pub fn add_schedule(
        env: Env,
        owner: Address,
        course: String,
        day: String,
        start_time: String,
        end_time: String,
        location: String,
    ) -> u32 {
        owner.require_auth();

        let index = next_index(&env, DataKey::ScheduleCount(owner.clone()));
        let record = ScheduleRecord {
            course,
            day,
            start_time,
            end_time,
            location,
            created_at: env.ledger().timestamp(),
        };
        let key = DataKey::Schedule(owner.clone(), index);

        env.storage().persistent().set(&key, &record);
        bump_persistent(&env, &key);
        env.events().publish((symbol_short!("sched"), owner), index);
        index
    }

    pub fn add_calculation(
        env: Env,
        owner: Address,
        formula: String,
        input_hash: String,
        result: String,
    ) -> u32 {
        owner.require_auth();

        let index = next_index(&env, DataKey::CalculationCount(owner.clone()));
        let record = CalculationRecord {
            formula,
            input_hash,
            result,
            created_at: env.ledger().timestamp(),
        };
        let key = DataKey::Calculation(owner.clone(), index);

        env.storage().persistent().set(&key, &record);
        bump_persistent(&env, &key);
        env.events().publish((symbol_short!("calc"), owner), index);
        index
    }

    pub fn get_grade(env: Env, owner: Address, index: u32) -> Option<GradeRecord> {
        let key = DataKey::Grade(owner, index);
        bump_persistent(&env, &key);
        env.storage().persistent().get(&key)
    }

    pub fn get_schedule(env: Env, owner: Address, index: u32) -> Option<ScheduleRecord> {
        let key = DataKey::Schedule(owner, index);
        bump_persistent(&env, &key);
        env.storage().persistent().get(&key)
    }

    pub fn get_calculation(env: Env, owner: Address, index: u32) -> Option<CalculationRecord> {
        let key = DataKey::Calculation(owner, index);
        bump_persistent(&env, &key);
        env.storage().persistent().get(&key)
    }

    pub fn grade_count(env: Env, owner: Address) -> u32 {
        get_count(&env, DataKey::GradeCount(owner))
    }

    pub fn schedule_count(env: Env, owner: Address) -> u32 {
        get_count(&env, DataKey::ScheduleCount(owner))
    }

    pub fn calculation_count(env: Env, owner: Address) -> u32 {
        get_count(&env, DataKey::CalculationCount(owner))
    }
}

fn next_index(env: &Env, key: DataKey) -> u32 {
    let index = get_count(env, key.clone());
    let next = index + 1;
    env.storage().persistent().set(&key, &next);
    bump_persistent(env, &key);
    index
}

fn get_count(env: &Env, key: DataKey) -> u32 {
    bump_persistent(env, &key);
    env.storage().persistent().get(&key).unwrap_or(0)
}

fn bump_persistent(env: &Env, key: &DataKey) {
    env.storage()
        .persistent()
        .extend_ttl(key, TTL_THRESHOLD, TTL_EXTEND_TO);
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env, String};

    fn text(env: &Env, value: &str) -> String {
        String::from_str(env, value)
    }

    fn setup(env: &Env) -> (Address, AcademicRecordsContractClient<'_>) {
        let contract_id = env.register(AcademicRecordsContract, ());
        let client = AcademicRecordsContractClient::new(&env, &contract_id);
        let admin = Address::generate(&env);

        client.initialize(&admin);
        (admin, client)
    }

    #[test]
    fn grade_records_are_append_only() {
        let env = Env::default();
        env.mock_all_auths();
        let (owner, client) = setup(&env);

        let first = client.add_grade(&owner, &text(&env, "Fizik"), &94, &text(&env, "2026 Bahar"));
        let second = client.add_grade(
            &owner,
            &text(&env, "Matematik"),
            &88,
            &text(&env, "2026 Bahar"),
        );

        assert_eq!(first, 0);
        assert_eq!(second, 1);
        assert_eq!(client.grade_count(&owner), 2);

        let record = client.get_grade(&owner, &0).unwrap();
        assert_eq!(record.course, text(&env, "Fizik"));
        assert_eq!(record.score, 94);
        assert_eq!(record.term, text(&env, "2026 Bahar"));
    }

    #[test]
    fn stores_schedule_and_formula_calculations() {
        let env = Env::default();
        env.mock_all_auths();
        let (owner, client) = setup(&env);

        let schedule_index = client.add_schedule(
            &owner,
            &text(&env, "Algoritmalar"),
            &text(&env, "Pazartesi"),
            &text(&env, "09:00"),
            &text(&env, "10:30"),
            &text(&env, "B-204"),
        );
        let calculation_index = client.add_calculation(
            &owner,
            &text(&env, "F = k * |q1 * q2| / r^2"),
            &text(&env, "sha256:q1=2,q2=3,r=4"),
            &text(&env, "3360956922112.50 N"),
        );

        assert_eq!(schedule_index, 0);
        assert_eq!(calculation_index, 0);
        assert_eq!(client.schedule_count(&owner), 1);
        assert_eq!(client.calculation_count(&owner), 1);

        let schedule = client.get_schedule(&owner, &0).unwrap();
        assert_eq!(schedule.course, text(&env, "Algoritmalar"));
        assert_eq!(schedule.location, text(&env, "B-204"));

        let calculation = client.get_calculation(&owner, &0).unwrap();
        assert_eq!(calculation.formula, text(&env, "F = k * |q1 * q2| / r^2"));
        assert_eq!(calculation.result, text(&env, "3360956922112.50 N"));
    }

    #[test]
    #[should_panic(expected = "score must be between 0 and 100")]
    fn rejects_invalid_grade_score() {
        let env = Env::default();
        env.mock_all_auths();
        let (owner, client) = setup(&env);

        client.add_grade(
            &owner,
            &text(&env, "Fizik"),
            &101,
            &text(&env, "2026 Bahar"),
        );
    }
}
