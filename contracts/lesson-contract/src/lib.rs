#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, symbol_short};

// Ders türü
#[contracttype]
#[derive(Clone)]
pub struct Lesson {
    pub id: String,
    pub title: String,
    pub price: i128, // stroops cinsinden (1 XLM = 10,000,000 stroops)
    pub instructor: Address,
    pub total_purchased: u32,
}

// Öğrenci satın alma kaydı
#[contracttype]
#[derive(Clone)]
pub struct Purchase {
    pub student: Address,
    pub lesson_id: String,
    pub instructor: Address,
    pub amount_paid: i128,
    pub timestamp: u64,
}

// Final sınav sonucu
#[contracttype]
#[derive(Clone)]
pub struct ExamResult {
    pub student: Address,
    pub score: u32,
    pub timestamp: u64,
}

// Ödül
#[contracttype]
#[derive(Clone)]
pub struct Reward {
    pub rank: u32,
    pub student: Address,
    pub amount: i128,
    pub description: String,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TokenAddress,
    Lessons,
    Purchases,
    ExamResults,
    Leaderboard,
    TotalRevenue,
    StudentBalance,
    Rewards,
}

#[contract]
pub struct LessonContract;

#[contractimpl]
impl LessonContract {
    /// Sözleşmeyi başlatır (yalnızca bir kez)
    pub fn initialize(env: Env, admin: Address, token_address: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TokenAddress, &token_address);
        env.storage().instance().set(&DataKey::TotalRevenue, &0i128);
        env.storage().instance().extend_ttl(100, 518400);
    }

    /// Yeni ders ekler (yalnızca admin)
    pub fn add_lesson(
        env: Env,
        lesson_id: String,
        title: String,
        price: i128,
        instructor: Address,
    ) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        admin.require_auth();

        let mut lessons: Vec<Lesson> = env
            .storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env));

        let lesson = Lesson {
            id: lesson_id,
            title,
            price,
            instructor,
            total_purchased: 0,
        };

        lessons.push_back(lesson);
        env.storage().instance().set(&DataKey::Lessons, &lessons);
        env.storage().instance().extend_ttl(100, 518400);
    }

    /// Dersi satın al (ödeme işlemi)
    pub fn purchase_lesson(
        env: Env,
        student: Address,
        lesson_id: String,
        instructor: Address,
    ) -> bool {
        student.require_auth();

        let mut lessons: Vec<Lesson> = env
            .storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env));

        let mut lesson_found = false;
        let mut amount_paid = 0i128;

        for i in 0..lessons.len() {
            let mut lesson = lessons.get_unchecked(i);
            if lesson.id == lesson_id && lesson.instructor == instructor {
                amount_paid = lesson.price;
                lesson.total_purchased += 1;
                lessons.set(i, lesson);
                lesson_found = true;
                break;
            }
        }

        if !lesson_found {
            panic!("Lesson not found");
        }

        // Ödeme işlemi simüle edildi (gerçek uygulamada token transferi yapılır)
        let purchase = Purchase {
            student: student.clone(),
            lesson_id,
            instructor,
            amount_paid,
            timestamp: env.ledger().timestamp(),
        };

        let mut purchases: Vec<Purchase> = env
            .storage()
            .instance()
            .get(&DataKey::Purchases)
            .unwrap_or(Vec::new(&env));

        purchases.push_back(purchase);
        env.storage().instance().set(&DataKey::Purchases, &purchases);

        // Toplam geliri güncelle
        let total_revenue: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalRevenue)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalRevenue, &(total_revenue + amount_paid));

        // Ders listesini güncelle
        env.storage().instance().set(&DataKey::Lessons, &lessons);
        env.storage().instance().extend_ttl(100, 518400);

        true
    }

    /// Öğrenci dersi satın aldı mı kontrol et
    pub fn has_purchased(
        env: Env,
        student: Address,
        lesson_id: String,
        instructor: Address,
    ) -> bool {
        let purchases: Vec<Purchase> = env
            .storage()
            .instance()
            .get(&DataKey::Purchases)
            .unwrap_or(Vec::new(&env));

        for purchase in purchases.iter() {
            if purchase.student == student
                && purchase.lesson_id == lesson_id
                && purchase.instructor == instructor
            {
                return true;
            }
        }
        false
    }

    /// Final sınav sonucunu kaydet
    pub fn submit_exam_result(env: Env, student: Address, score: u32) {
        student.require_auth();

        if score > 100 {
            panic!("Score must be between 0 and 100");
        }

        let mut results: Vec<ExamResult> = env
            .storage()
            .instance()
            .get(&DataKey::ExamResults)
            .unwrap_or(Vec::new(&env));

        let result = ExamResult {
            student,
            score,
            timestamp: env.ledger().timestamp(),
        };

        results.push_back(result);
        env.storage().instance().set(&DataKey::ExamResults, &results);
        env.storage().instance().extend_ttl(100, 518400);
    }

    /// Leaderboard'u getir (ilk 10)
    pub fn get_leaderboard(env: Env) -> Vec<ExamResult> {
        let mut results: Vec<ExamResult> = env
            .storage()
            .instance()
            .get(&DataKey::ExamResults)
            .unwrap_or(Vec::new(&env));

        // Puanlara göre sırala (büyükten küçüğe)
        for i in 0..results.len() {
            for j in (i + 1)..results.len() {
                let result_i = results.get_unchecked(i);
                let result_j = results.get_unchecked(j);
                if result_i.score < result_j.score {
                    let temp = result_i.clone();
                    results.set(i, result_j.clone());
                    results.set(j, temp);
                }
            }
        }

        // İlk 10'u döndür
        let mut top_10 = Vec::new(&env);
        let limit = if results.len() > 10 { 10 } else { results.len() };

        for i in 0..limit {
            top_10.push_back(results.get_unchecked(i));
        }

        top_10
    }

    /// Ödülü talep et (ilk 3 için)
    pub fn claim_reward(env: Env, student: Address) -> i128 {
        student.require_auth();

        let leaderboard = Self::get_leaderboard(env.clone());
        let mut reward_amount = 0i128;

        for i in 0..leaderboard.len() {
            let entry = leaderboard.get_unchecked(i);
            if entry.student == student {
                match i {
                    0 => reward_amount = 1000000, // 1. sıra: 0.1 XLM
                    1 => reward_amount = 700000,  // 2. sıra: 0.07 XLM
                    2 => reward_amount = 400000,  // 3. sıra: 0.04 XLM
                    _ => panic!("No reward for this rank"),
                }
                break;
            }
        }

        if reward_amount == 0 {
            panic!("Student not in top 3");
        }

        // Bakiye güncelle (gerçek uygulamada XLM gönderilir)
        let mut balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::StudentBalance)
            .unwrap_or(0);
        balance += reward_amount;

        env.storage()
            .instance()
            .set(&DataKey::StudentBalance, &balance);
        env.storage().instance().extend_ttl(100, 518400);

        reward_amount
    }

    /// Tüm dersleri getir
    pub fn get_all_lessons(env: Env) -> Vec<Lesson> {
        env.storage()
            .instance()
            .get(&DataKey::Lessons)
            .unwrap_or(Vec::new(&env))
    }

    /// Toplam geliri getir (yalnızca admin)
    pub fn get_total_revenue(env: Env) -> i128 {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        admin.require_auth();

        env.storage()
            .instance()
            .get(&DataKey::TotalRevenue)
            .unwrap_or(0)
    }

    /// Öğrencinin satın aldığı tüm dersleri getir
    pub fn get_student_purchases(env: Env, student: Address) -> Vec<Purchase> {
        let purchases: Vec<Purchase> = env
            .storage()
            .instance()
            .get(&DataKey::Purchases)
            .unwrap_or(Vec::new(&env));

        let mut student_purchases = Vec::new(&env);
        for purchase in purchases.iter() {
            if purchase.student == student {
                student_purchases.push_back(purchase);
            }
        }

        student_purchases
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_lesson_contract_initialization() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(LessonContract, ());
        let client = LessonContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        client.initialize(&admin, &token);

        let lessons = client.get_all_lessons();
        assert_eq!(lessons.len(), 0);
    }

    #[test]
    fn test_add_and_purchase_lesson() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(LessonContract, ());
        let client = LessonContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);
        let student = Address::generate(&env);
        let instructor = Address::generate(&env);

        client.initialize(&admin, &token);

        let lesson_id = String::from_small_str("coulomb-1");
        let title = String::from_small_str("Coulomb Yasası");
        let price = 5000000i128; // 0.5 XLM

        client.add_lesson(&lesson_id, &title, &price, &instructor);

        let lessons = client.get_all_lessons();
        assert_eq!(lessons.len(), 1);

        let purchased = client.purchase_lesson(&student, &lesson_id, &instructor);
        assert!(purchased);

        let has_purchased = client.has_purchased(&student, &lesson_id, &instructor);
        assert!(has_purchased);
    }

    #[test]
    fn test_exam_result_and_reward() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(LessonContract, ());
        let client = LessonContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let token = Address::generate(&env);

        client.initialize(&admin, &token);

        let student1 = Address::generate(&env);
        let student2 = Address::generate(&env);
        let student3 = Address::generate(&env);

        client.submit_exam_result(&student1, &98);
        client.submit_exam_result(&student2, &92);
        client.submit_exam_result(&student3, &85);

        let leaderboard = client.get_leaderboard();
        assert_eq!(leaderboard.len(), 3);
        assert_eq!(leaderboard.get_unchecked(0).score, 98);
    }
}
