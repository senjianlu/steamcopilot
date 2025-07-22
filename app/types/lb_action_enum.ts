/**
 * 玩家行动枚举
 * 表示玩家在游戏中可能的行动状态
 */
export enum LbAction {
  DIE = "Die",            // 玩家死亡
  WIN = "Win",            // 玩家获胜
  GOD_SAVED = "God Saved" // 玩家被上帝救了
}

/**
 * 获取所有行动枚举的键值对对象
 */
export const LbActionMap = {
  "DIE": "Die", 
  "WIN": "Win", 
  "GOD_SAVED": "God Saved"
};
