-- Liar's Bar 数据库表结构 (通用SQL语法)

-- ========================================
-- lb_play 表 - 玩家信息表
-- ========================================
CREATE TABLE lb_play (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 为lb_play创建索引
CREATE INDEX idx_lb_play_name ON lb_play(name);

-- ========================================
-- lb_record 表 - 游戏记录表
-- ========================================
CREATE TABLE lb_record (
  uuid VARCHAR(36) NOT NULL UNIQUE,
  match_id INTEGER NOT NULL,
  match_name VARCHAR(200) NOT NULL,
  game_round INTEGER NOT NULL DEFAULT 1,
  game_turn INTEGER NOT NULL DEFAULT 1,
  
  -- 玩家1信息
  player_id INTEGER NOT NULL,
  player1_count INTEGER NOT NULL DEFAULT 0,
  player1_action VARCHAR(50) NOT NULL,
  is_player1_alive INTEGER NOT NULL DEFAULT 1,
  
  -- 玩家2信息
  player2_id INTEGER NOT NULL,
  player2_count INTEGER NOT NULL DEFAULT 0,
  player2_action VARCHAR(50) NOT NULL,
  is_player2_alive INTEGER NOT NULL DEFAULT 1,
  
  -- 玩家3信息
  player3_id INTEGER NOT NULL,
  player3_count INTEGER NOT NULL DEFAULT 0,
  player3_action VARCHAR(50) NOT NULL,
  is_player3_alive INTEGER NOT NULL DEFAULT 1,
  
  -- 玩家4信息
  player4_id INTEGER NOT NULL,
  player4_count INTEGER NOT NULL DEFAULT 0,
  player4_action VARCHAR(50) NOT NULL,
  is_player4_alive INTEGER NOT NULL DEFAULT 1,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 为lb_record创建索引
CREATE UNIQUE INDEX uk_lb_record_uuid ON lb_record(uuid);
CREATE INDEX idx_lb_record_match_id ON lb_record(match_id);
CREATE INDEX idx_lb_record_match_name ON lb_record(match_name);
CREATE INDEX idx_lb_record_game_round_turn ON lb_record(game_round, game_turn);
CREATE INDEX idx_lb_record_created_at ON lb_record(created_at);
