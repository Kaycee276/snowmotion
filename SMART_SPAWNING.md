# Smart Spawning & Difficulty System

## ✅ Features Implemented

### 1. **Smart Spawning Algorithm**

The game now uses an intelligent spawning system that checks what item you need next to build a snowman and makes that item more likely to appear.

**How it works:**

- The system tracks your current progress (e.g., you have snowball ❄️, next you need coal ⚫)
- Based on difficulty level, it has a weighted chance to spawn the needed item
- Higher difficulty = less help from smart spawning (more chaos!)

**Smart Spawn Rates by Difficulty:**

- **Easy**: 70% chance to spawn needed item
- **Medium**: 50% chance to spawn needed item
- **Hard**: 30% chance to spawn needed item
- **Expert**: 15% chance to spawn needed item (mostly random)

### 2. **Difficulty Levels**

Four difficulty levels with different gameplay parameters:

#### 🟢 Easy

- **Fall Speed**: 0.1x - 0.3x
- **Spawn Interval**: 1.5s - 2.5s
- **Smart Spawn**: 70%
- **Description**: Slow falling items, plenty of time to build

#### 🟡 Medium (Default)

- **Fall Speed**: 0.2x - 0.5x
- **Spawn Interval**: 1.0s - 2.0s
- **Smart Spawn**: 50%
- **Description**: Balanced speed and spawn rate

#### 🟠 Hard

- **Fall Speed**: 0.4x - 0.8x
- **Spawn Interval**: 0.6s - 1.5s
- **Smart Spawn**: 30%
- **Description**: Fast items, less time to think

#### 🔴 Expert

- **Fall Speed**: 0.6x - 1.2x
- **Spawn Interval**: 0.4s - 1.0s
- **Smart Spawn**: 15%
- **Description**: Extreme speed, minimal smart spawning

### 3. **Difficulty Selector UI**

- Beautiful difficulty selection screen before starting the game
- Shows difficulty details (speed range, smart spawn rate)
- Visual feedback for selected difficulty
- Can change difficulty before each game

### 4. **In-Game Hints**

- Shows "Next: ❄️/⚫/🥕/🎩" indicator to remind you what you need
- Displays current difficulty level during gameplay
- Real-time progress tracking

## 📁 Files Created/Modified

### New Files:

- `src/types/difficulty.ts` - Difficulty level types and configurations
- `src/utils/smartSpawn.ts` - Smart spawning algorithm
- `src/components/DifficultySelector.tsx` - Difficulty selection UI

### Modified Files:

- `src/store/gameStore.ts` - Added difficulty state and `getNextNeededItem()` function
- `src/components/Game.tsx` - Integrated smart spawning and difficulty settings

## 🎮 How to Use

1. **Select Difficulty**: Choose your difficulty level on the start screen
2. **Play**: The game will spawn items with bias towards what you need
3. **Check Hints**: Look at the "Next:" indicator to see what item you need
4. **Adapt**: Higher difficulties = faster items and less smart spawning help

## 🧠 Algorithm Details

The smart spawning algorithm:

```typescript
1. Check what item is needed next (snowball → coal → carrot → hat)
2. Roll random number (0-1)
3. If random < difficulty.weight:
   → Spawn the needed item
4. Else:
   → Spawn a random item (80% non-scarf, 20% scarf for bonus)
```

This ensures:

- You get help when you need it (especially on easy/medium)
- Game stays challenging on hard/expert
- Scarf remains special (lower spawn rate for bonus points)

## 🚀 Future Enhancements

- Dynamic difficulty adjustment based on performance
- Power-ups that temporarily increase smart spawn rate
- Difficulty-specific achievements
- Leaderboards filtered by difficulty level
