export class LbRecord {
  constructor(
    public matchId: number,        // 比赛ID
    public matchName: string,      // 比赛名称
    public gameRound: number,      // 游戏轮数
    public gameTurn: number,       // 游戏回合数（每轮内的回合）
    public playerId: number,
    // 玩家 1
    public player1Count: number,
    public player1Action: string,
    public isPlayer1Alive: boolean,
    // 玩家 2
    public player2Id: number,
    public player2Count: number,
    public player2Action: string,
    public isPlayer2Alive: boolean,
    // 玩家 3
    public player3Id: number,
    public player3Count: number,
    public player3Action: string,
    public isPlayer3Alive: boolean,
    // 玩家 4
    public player4Id: number,
    public player4Count: number,
    public player4Action: string,
    public isPlayer4Alive: boolean,
  ) {}
}