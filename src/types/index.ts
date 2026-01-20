/**
 * Type Definitions for Bartimaeus Idle RPG
 *
 * Defines TypeScript types and interfaces for the game
 */

// ===== Hero Types =====

export type HeroRole = 'Tank' | 'Damage' | 'Support';

export interface HeroStats {
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
}

export interface HeroData {
  id: number;
  name: string;
  role: HeroRole;
  level: number;
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;
  unlockedSkills: string[];
}

// ===== Enemy Types =====

export type EnemyType = 'Goblin' | 'Orc' | 'Skeleton' | 'Demon' | 'Dragon';

export interface EnemyStats {
  health: number;
  attack: number;
  defense: number;
}

// ===== Battle Types =====

export interface DamageNumber {
  x: number;
  y: number;
  damage: number;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
  isHeal: boolean;
}

export type BattleMode = 'HORDE';

// ===== Save State Types =====

export interface SaveState {
  hero: HeroData;
  currentStage: number;
  resources: {
    gold: number;
    gems: number;
  };
  lastSaveTime: number;
  version: string;
}

// ===== Resource Types =====

export interface ResourceState {
  gold: number;
  gems: number;
}

// ===== Skill Types =====

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  damage: number;
  targets: 'single' | 'all' | 'random';
  effect?: string;
}

export interface SkillState {
  skillId: string;
  cooldownRemaining: number;
}

// ===== Asset Types =====

export interface AssetDefinition {
  id: string;
  url: string;
  type: 'svg' | 'image';
}

// ===== Adventure Log Types =====

export interface LogEntry {
  message: string;
  timestamp: number;
  type: 'combat' | 'reward' | 'stage' | 'wave' | 'defeat' | 'respawn';
}

// ===== UI Types =====

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

// ===== Game Config =====

export interface GameConfig {
  attackInterval: number;
  maxLogEntries: number;
  saveInterval: number;
  speedMultipliers: number[];
}
