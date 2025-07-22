export class LbRecord {
  constructor(
    public uuid: string,           // UUID主键
    public matchId: number,        // 比赛ID
    public matchName: string,      // 比赛名称
    public gameRound: number,      // 游戏轮数
    public gameTurn: number,       // 游戏回合数（每轮内的回合）
    // 玩家 1
    public playerId: number,
    public player1Count: number,
    public player1Action: string,
    public isPlayer1Alive: number,
    // 玩家 2
    public player2Id: number,
    public player2Count: number,
    public player2Action: string,
    public isPlayer2Alive: number,
    // 玩家 3
    public player3Id: number,
    public player3Count: number,
    public player3Action: string,
    public isPlayer3Alive: number,
    // 玩家 4
    public player4Id: number,
    public player4Count: number,
    public player4Action: string,
    public isPlayer4Alive: number,
    // 时间戳字段
    public created_at?: string,
    public updated_at?: string,
  ) {}
}