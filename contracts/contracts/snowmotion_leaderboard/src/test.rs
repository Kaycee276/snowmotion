#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

#[test]
fn test_initialization() {
    let env = Env::default();
    let contract_id = env.register(SnowmotionLeaderboard, ());
    let client = SnowmotionLeaderboardClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    assert_eq!(client.get_admin(), admin);

    // Initializing again should fail
    let res = client.try_init(&admin);
    assert_eq!(res, Err(Ok(Error::AlreadyInitialized)));
}

#[test]
fn test_submit_score_and_sorting() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SnowmotionLeaderboard, ());
    let client = SnowmotionLeaderboardClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let charlie = Address::generate(&env);

    let hash_1 = BytesN::from_array(&env, &[1u8; 32]);
    let hash_2 = BytesN::from_array(&env, &[2u8; 32]);
    let hash_3 = BytesN::from_array(&env, &[3u8; 32]);

    client.submit_score(&alice, &50, &0, &hash_1);
    client.submit_score(&bob, &100, &1, &hash_2);
    client.submit_score(&charlie, &75, &2, &hash_3);

    let board = client.get_leaderboard();
    assert_eq!(board.len(), 3);

    // Sorted descending: Bob (100) -> Charlie (75) -> Alice (50)
    assert_eq!(board.get(0).unwrap().player, bob);
    assert_eq!(board.get(0).unwrap().score, 100);

    assert_eq!(board.get(1).unwrap().player, charlie);
    assert_eq!(board.get(1).unwrap().score, 75);

    assert_eq!(board.get(2).unwrap().player, alice);
    assert_eq!(board.get(2).unwrap().score, 50);

    // Player best tracking
    assert_eq!(client.get_player_best(&bob), 100);
    assert_eq!(client.get_player_best(&alice), 50);
}

#[test]
fn test_replay_protection() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SnowmotionLeaderboard, ());
    let client = SnowmotionLeaderboardClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let alice = Address::generate(&env);
    let hash = BytesN::from_array(&env, &[42u8; 32]);

    assert!(!client.is_game_recorded(&hash));
    client.submit_score(&alice, &80, &1, &hash);
    assert!(client.is_game_recorded(&hash));

    // Trying to submit with same hash must return GameAlreadyRecorded
    let res = client.try_submit_score(&alice, &85, &1, &hash);
    assert_eq!(res, Err(Ok(Error::GameAlreadyRecorded)));
}

#[test]
fn test_invalid_difficulty() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SnowmotionLeaderboard, ());
    let client = SnowmotionLeaderboardClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.init(&admin);

    let player = Address::generate(&env);
    let hash = BytesN::from_array(&env, &[99u8; 32]);

    // Difficulty 3 is out of bounds (allowed: 0, 1, 2)
    let res = client.try_submit_score(&player, &100, &3, &hash);
    assert_eq!(res, Err(Ok(Error::InvalidDifficulty)));
}
