#![no_std]
use soroban_sdk::{contractimpl, Env, Symbol, Address, Map, BytesN};

pub struct EducationContract;

#[derive(Clone)]
pub struct Lesson {
    pub id: u32,
    pub price: u32,
    pub owner: Address,
}

#[contractimpl]
impl EducationContract {
    pub fn purchase_lesson(env: Env, lesson_id: u32, buyer: Address, amount: u32) -> bool {
        let lessons: Map<u32, Lesson> = env.storage().persistent().get(&Symbol::new("lessons")).unwrap_or_default();
        if let Some(lesson) = lessons.get(&lesson_id) {
            if amount >= lesson.price {
                // Transfer payment logic
                let mut balances: Map<Address, u32> = env.storage().persistent().get(&Symbol::new("balances")).unwrap_or_default();
                let balance = balances.get(&lesson.owner).unwrap_or(0);
                balances.set(&lesson.owner, &(balance + amount));
                env.storage().persistent().set(&Symbol::new("balances"), &balances);
                return true;
            }
        }
        false
    }

    pub fn get_balance(env: Env, owner: Address) -> u32 {
        let balances: Map<Address, u32> = env.storage().persistent().get(&Symbol::new("balances")).unwrap_or_default();
        balances.get(&owner).unwrap_or(0)
    }

    pub fn withdraw(env: Env, owner: Address, amount: u32) -> bool {
        let mut balances: Map<Address, u32> = env.storage().persistent().get(&Symbol::new("balances")).unwrap_or_default();
        let balance = balances.get(&owner).unwrap_or(0);
        if balance >= amount {
            balances.set(&owner, &(balance - amount));
            env.storage().persistent().set(&Symbol::new("balances"), &balances);
            return true;
        }
        false
    }
}