import { LbRecord } from '@/app/@types/lb_record';
import { LbAction } from '@/app/@types/lb_action_enum';

export const mockLbRecords: LbRecord[] = [
  new LbRecord(
    1001,                // matchId
    "猎人的对决",         // matchName
    1,                   // gameRound
    1,                   // gameTurn
    // 玩家1
    1,                   // playerId
    4,                   // player1Count
    LbAction.WIN,        // player1Action
    1,                   // isPlayer1Alive
    // 玩家2
    2,                   // player2Id
    2,                   // player2Count
    "",                  // player2Action
    1,                   // isPlayer2Alive
    // 玩家3
    3,                   // player3Id
    8,                   // player3Count
    "",                  // player3Action
    1,                   // isPlayer3Alive
    // 玩家4
    4,                   // player4Id
    0,                   // player4Count
    LbAction.DIE,        // player4Action
    0                    // isPlayer4Alive
  ),
  new LbRecord(
    1001,                // matchId
    "猎人的对决",         // matchName
    1,                   // gameRound
    2,                   // gameTurn
    // 玩家1
    1,                   // playerId
    0,                   // player1Count
    "",                  // player1Action
    1,                   // isPlayer1Alive
    // 玩家2
    2,                   // player2Id
    1,                   // player2Count
    "",                  // player2Action
    1,                   // isPlayer2Alive
    // 玩家3
    3,                   // player3Id
    0,                   // player3Count
    LbAction.WIN,        // player3Action
    1,                   // isPlayer3Alive
    // 玩家4
    4,                   // player4Id
    0,                   // player4Count
    "",                  // player4Action
    0                    // isPlayer4Alive
  ),
  new LbRecord(
    1001,                // matchId
    "猎人的对决",         // matchName
    1,                   // gameRound
    3,                   // gameTurn
    // 玩家1
    1,                   // playerId
    0,                   // player1Count
    LbAction.DIE,        // player1Action
    0,                   // isPlayer1Alive
    // 玩家2
    2,                   // player2Id
    0,                   // player2Count
    "",                  // player2Action
    1,                   // isPlayer2Alive
    // 玩家3
    3,                   // player3Id
    5,                   // player3Count
    LbAction.WIN,        // player3Action
    1,                   // isPlayer3Alive
    // 玩家4
    4,                   // player4Id
    0,                   // player4Count
    "",                  // player4Action
    0                    // isPlayer4Alive
  ),
  new LbRecord(
    1002,                // matchId
    "酒吧决战",          // matchName
    1,                   // gameRound
    1,                   // gameTurn
    // 玩家1
    5,                   // playerId
    0,                   // player1Count
    "",                  // player1Action
    1,                   // isPlayer1Alive
    // 玩家2
    6,                   // player2Id
    3,                   // player2Count
    "",                  // player2Action
    1,                   // isPlayer2Alive
    // 玩家3
    7,                   // player3Id
    2,                   // player3Count
    LbAction.DIE,        // player3Action
    0,                   // isPlayer3Alive
    // 玩家4
    8,                   // player4Id
    6,                   // player4Count
    LbAction.WIN,        // player4Action
    1                    // isPlayer4Alive
  ),
  new LbRecord(
    1002,                // matchId
    "酒吧决战",          // matchName
    1,                   // gameRound
    2,                   // gameTurn
    // 玩家1
    5,                   // playerId
    3,                   // player1Count
    LbAction.GOD_SAVED,  // player1Action
    1,                   // isPlayer1Alive
    // 玩家2
    6,                   // player2Id
    4,                   // player2Count
    LbAction.WIN,        // player2Action
    1,                   // isPlayer2Alive
    // 玩家3
    7,                   // player3Id
    0,                   // player3Count
    "",                  // player3Action
    0,                   // isPlayer3Alive
    // 玩家4
    8,                   // player4Id
    1,                   // player4Count
    "",                  // player4Action
    1                    // isPlayer4Alive
  )
];

// 按匹配ID分组
export const getRecordsByMatchId = (matchId: number): LbRecord[] => {
  return mockLbRecords.filter(record => record.matchId === matchId);
};

// 获取所有不同的对局
export const getAllMatches = (): {id: number, name: string}[] => {
  const uniqueMatches = new Map<number, string>();
  
  mockLbRecords.forEach(record => {
    if (!uniqueMatches.has(record.matchId)) {
      uniqueMatches.set(record.matchId, record.matchName);
    }
  });
  
  return Array.from(uniqueMatches.entries()).map(([id, name]) => ({
    id,
    name
  }));
};
