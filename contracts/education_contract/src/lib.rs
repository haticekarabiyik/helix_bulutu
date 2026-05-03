#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Vec};

const TTL_THRESHOLD: u32 = 100;
const TTL_EXTEND_TO: u32 = 518_400;

#[contracttype]
#[derive(Clone)]
pub struct Lesson {
    pub id: u32,
    pub title: String,
    pub price: u32,
    pub owner: Address,
}

#[contracttype]
#[derive(Clone)]
pub struct PurchaseRecord {
    pub lesson_id: u32,
    pub buyer: Address,
    pub amount: u32,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Lessons,
    LessonCount,
    Purchases,
    Balance(Address),
}

#[contract]
pub struct EducationContract;

#[contractimpl]
impl EducationContract {
    /// Sözleşmeyi başlatır (yalnızca bir kez)
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::LessonCount, &0u32);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);
    }

    /// Yeni ders ekler (yalnızca admin)
    pub fn add_lesson(env: Env, title: String, price: u32, owner: Address) -> u32 {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        admin.require_auth();

        let id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::LessonCount)
            .unwrap_or(0);

        let lesson = Lesson {
            id,
            title,
            price,
            owner,
        };

        let mut lessons: Vec<Lesson> = env
            .storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env));

        lessons.push_back(lesson);
        env.storage().instance().set(&DataKey::Lessons, &lessons);
        env.storage()
            .instance()
            .set(&DataKey::LessonCount, &(id + 1));
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);

        env.events().publish((symbol_short!("lesson"),), id);
        id
    }

    /// Ders satın alma
    pub fn purchase_lesson(env: Env, lesson_id: u32, buyer: Address, amount: u32) -> bool {
        buyer.require_auth();

        let lessons: Vec<Lesson> = env
            .storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env));

        let mut found = false;
        let mut lesson_owner: Option<Address> = None;
        let mut lesson_price: u32 = 0;

        for i in 0..lessons.len() {
            let lesson = lessons.get_unchecked(i);
            if lesson.id == lesson_id {
                lesson_price = lesson.price;
                lesson_owner = Some(lesson.owner.clone());
                found = true;
                break;
            }
        }

        if !found {
            panic!("lesson not found");
        }

        if amount < lesson_price {
            panic!("insufficient payment");
        }

        // Eğitmenin bakiyesini güncelle
        if let Some(owner) = lesson_owner {
            let balance_key = DataKey::Balance(owner.clone());
            let current_balance: u32 = env
                .storage()
                .persistent()
                .get(&balance_key)
                .unwrap_or(0);

            env.storage()
                .persistent()
                .set(&balance_key, &(current_balance + amount));
            env.storage()
                .persistent()
                .extend_ttl(&balance_key, TTL_THRESHOLD, TTL_EXTEND_TO);
        }

        // Satın alma kaydını sakla
        let purchase = PurchaseRecord {
            lesson_id,
            buyer: buyer.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };

        let mut purchases: Vec<PurchaseRecord> = env
            .storage()
            .instance()
            .get(&DataKey::Purchases)
            .unwrap_or(Vec::new(&env));

        purchases.push_back(purchase);
        env.storage()
            .instance()
            .set(&DataKey::Purchases, &purchases);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND_TO);

        env.events()
            .publish((symbol_short!("purchase"), buyer), lesson_id);

        true
    }

    /// Eğitmenin bakiyesini sorgula
    pub fn get_balance(env: Env, owner: Address) -> u32 {
        let balance_key = DataKey::Balance(owner);
        env.storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0)
    }

    /// Bakiye çekme (yalnızca kendi bakiyesini çekebilir)
    pub fn withdraw(env: Env, owner: Address, amount: u32) -> bool {
        owner.require_auth();

        let balance_key = DataKey::Balance(owner.clone());
        let current_balance: u32 = env
            .storage()
            .persistent()
            .get(&balance_key)
            .unwrap_or(0);

        if current_balance < amount {
            panic!("insufficient balance");
        }

        env.storage()
            .persistent()
            .set(&balance_key, &(current_balance - amount));
        env.storage()
            .persistent()
            .extend_ttl(&balance_key, TTL_THRESHOLD, TTL_EXTEND_TO);

        env.events()
            .publish((symbol_short!("withdraw"), owner), amount);

        true
    }

    /// Tüm dersleri getir
    pub fn get_all_lessons(env: Env) -> Vec<Lesson> {
        env.storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env))
    }

    /// Tüm satın almaları getir
    pub fn get_all_purchases(env: Env) -> Vec<PurchaseRecord> {
        env.storage()
            .instance()
            .get(&DataKey::Purchases)
            .unwrap_or(Vec::new(&env))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{Address, Env, String};

    fn setup(env: &Env) -> (Address, EducationContractClient<'_>) {
        let contract_id = env.register(EducationContract, ());
        let client = EducationContractClient::new(env, &contract_id);
        let admin = Address::generate(env);
        client.initialize(&admin);
        (admin, client)
    }

    #[test]
    fn test_add_lesson_and_purchase() {
        let env = Env::default();
        env.mock_all_auths();
        let (_admin, client) = setup(&env);

        let owner = Address::generate(&env);
        let buyer = Address::generate(&env);
        let title = String::from_str(&env, "Fizik 101");

        let id = client.add_lesson(&title, &50, &owner);
        assert_eq!(id, 0);

        let lessons = client.get_all_lessons();
        assert_eq!(lessons.len(), 1);

        let result = client.purchase_lesson(&id, &buyer, &50);
        assert!(result);

        let balance = client.get_balance(&owner);
        assert_eq!(balance, 50);
    }

    #[test]
    fn test_withdraw() {
        let env = Env::default();
        env.mock_all_auths();
        let (_admin, client) = setup(&env);

        let owner = Address::generate(&env);
        let buyer = Address::generate(&env);
        let title = String::from_str(&env, "Matematik");

        client.add_lesson(&title, &100, &owner);
        client.purchase_lesson(&0, &buyer, &100);

        let before = client.get_balance(&owner);
        assert_eq!(before, 100);

        client.withdraw(&owner, &60);

        let after = client.get_balance(&owner);
        assert_eq!(after, 40);
    }

    #[test]
    #[should_panic(expected = "insufficient payment")]
    fn test_insufficient_payment() {
        let env = Env::default();
        env.mock_all_auths();
        let (_admin, client) = setup(&env);

        let owner = Address::generate(&env);
        let buyer = Address::generate(&env);
        let title = String::from_str(&env, "Kimya");

        client.add_lesson(&title, &100, &owner);
        client.purchase_lesson(&0, &buyer, &50); // Yetersiz ödeme
    }
}