#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, BytesN, Env, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidDifficulty = 3,
    GameAlreadyRecorded = 4,
    Unauthorized = 5,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Leaderboard,
    GameHash(BytesN<32>),
    PlayerBest(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ScoreEntry {
    pub player: Address,
    pub score: u32,
    pub difficulty: u32, // 0 = Easy, 1 = Medium, 2 = Hard
    pub timestamp: u64,
    pub game_hash: BytesN<32>,
}

const MAX_LEADERBOARD_ENTRIES: u32 = 50;

#[contract]
pub struct SnowmotionLeaderboard;

#[contractimpl]
impl SnowmotionLeaderboard {
    /// Initialize the contract with an admin address. Can only be called once.
    pub fn init(env: Env, admin: Address) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);

        let empty_board: Vec<ScoreEntry> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Leaderboard, &empty_board);

        Ok(())
    }

    /// Returns the contract admin address.
    pub fn get_admin(env: Env) -> Result<Address, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .ok_or(Error::NotInitialized)
    }

    /// Check if a game session hash has already been registered (replay guard).
    pub fn is_game_recorded(env: Env, game_hash: BytesN<32>) -> bool {
        env.storage().persistent().has(&DataKey::GameHash(game_hash))
    }

    /// Returns the top global leaderboard entries.
    pub fn get_leaderboard(env: Env) -> Vec<ScoreEntry> {
        env.storage()
            .instance()
            .get(&DataKey::Leaderboard)
            .unwrap_or_else(|| Vec::new(&env))
    }

    /// Returns the personal high score for a specific player address.
    pub fn get_player_best(env: Env, player: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::PlayerBest(player))
            .unwrap_or(0)
    }

    /// Submit a verified game score.
    /// Either the player signs directly or the admin signs to relay.
    pub fn submit_score(
        env: Env,
        player: Address,
        score: u32,
        difficulty: u32,
        game_hash: BytesN<32>,
    ) -> Result<u32, Error> {
        if difficulty > 2 {
            return Err(Error::InvalidDifficulty);
        }

        // Replay attack prevention: Ensure the game session hash hasn't been submitted before
        if Self::is_game_recorded(env.clone(), game_hash.clone()) {
            return Err(Error::GameAlreadyRecorded);
        }

        // Authentication: Contract admin (authorized backend relayer) must authenticate submission
        let admin = Self::get_admin(env.clone())?;
        admin.require_auth();

        let timestamp = env.ledger().timestamp();

        // Mark game hash as recorded
        env.storage()
            .persistent()
            .set(&DataKey::GameHash(game_hash.clone()), &true);

        // Update player best score if higher
        let current_best = Self::get_player_best(env.clone(), player.clone());
        if score > current_best {
            env.storage()
                .persistent()
                .set(&DataKey::PlayerBest(player.clone()), &score);
        }

        // Insert into leaderboard sorted descending by score
        let new_entry = ScoreEntry {
            player: player.clone(),
            score,
            difficulty,
            timestamp,
            game_hash,
        };

        let leaderboard = Self::get_leaderboard(env.clone());
        let mut inserted = false;
        let mut new_board = Vec::new(&env);

        let len = leaderboard.len();
        let mut i = 0;
        while i < len {
            let item = leaderboard.get(i).unwrap();
            if !inserted && new_entry.score >= item.score {
                new_board.push_back(new_entry.clone());
                inserted = true;
            }
            if new_board.len() < MAX_LEADERBOARD_ENTRIES {
                new_board.push_back(item);
            }
            i += 1;
        }

        if !inserted && new_board.len() < MAX_LEADERBOARD_ENTRIES {
            new_board.push_back(new_entry);
        }

        env.storage()
            .instance()
            .set(&DataKey::Leaderboard, &new_board);

        // Emit leaderboard update event
        env.events()
            .publish((symbol_short!("score"), player), score);

        Ok(score)
    }
}

mod test;
