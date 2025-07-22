"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameRecord {
  round: number;
  game: number;
  players: (string | number)[];
}

interface SavedGameSession {
  id: number;
  date: string;
  playerNames: string[];
  records: GameRecord[];
  bulletStats?: { name: string; bullets: number }[];
}

export default function LiarsBarPage() {
  const [playerNames, setPlayerNames] = useState([
    "玩家一", "玩家二", "玩家三", "玩家四"
  ]);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([
    { round: 1, game: 1, players: ["4", "2", "8", "Winner"] },
    { round: 1, game: 2, players: ["", "1", "", "Winner"] },
    { round: 1, game: 3, players: ["", "Winner", "", "5"] }
  ]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentGame, setCurrentGame] = useState(3);
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [editingCell, setEditingCell] = useState<{round: number, game: number, player: number} | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedGameSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [bulletStats, setBulletStats] = useState<{ name: string; bullets: number }[]>([]);
  const [showStats, setShowStats] = useState(false);

  // 从 localStorage 加载数据
  useEffect(() => {
    const saved = localStorage.getItem('liarsBarSessions');
    if (saved) {
      setSavedSessions(JSON.parse(saved));
    }
  }, []);

  // 保存数据到 localStorage
  const saveToLocalStorage = (sessions: SavedGameSession[]) => {
    localStorage.setItem('liarsBarSessions', JSON.stringify(sessions));
  };

  const handlePlayerNameChange = (index: number, newName: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = newName;
    setPlayerNames(updatedNames);
  };

  const handleCellEdit = (round: number, game: number, playerIndex: number, value: string) => {
    setGameRecords(prevRecords => 
      prevRecords.map(record => 
        record.round === round && record.game === game 
          ? { ...record, players: record.players.map((p, i) => i === playerIndex ? value : p) }
          : record
      )
    );
  };

  const startNewRound = () => {
    const newRound = currentRound + 1;
    setCurrentRound(newRound);
    setCurrentGame(1);
    setGameRecords(prev => [...prev, { round: newRound, game: 1, players: ["", "", "", ""] }]);
  };

  const startNewGame = () => {
    const newGameNumber = currentGame + 1;
    setCurrentGame(newGameNumber);
    setGameRecords(prev => [...prev, { round: currentRound, game: newGameNumber, players: ["", "", "", ""] }]);
  };

  const calculateBulletStats = () => {
    const stats = playerNames.map((name, index) => {
      const bullets = gameRecords.reduce((sum, record) => {
        const value = record.players[index];
        if (value === "Winner" || value === "" || value === "Die") return sum;
        const num = parseInt(value as string);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
      return { name, bullets };
    });
    
    setBulletStats(stats);
    setShowStats(true);
    
    return stats;
  };

  const settlement = () => {
    const stats = calculateBulletStats();
    const message = `子弹消耗统计：\n${stats.map(s => `${s.name}: ${s.bullets} 发子弹`).join('\n')}`;
    alert(message);
  };

  const saveCurrentSession = () => {
    const stats = calculateBulletStats();
    const newSession: SavedGameSession = {
      id: Date.now(),
      date: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '/'),
      playerNames: [...playerNames],
      records: [...gameRecords],
      bulletStats: stats
    };
    
    const updatedSessions = [newSession, ...savedSessions];
    setSavedSessions(updatedSessions);
    saveToLocalStorage(updatedSessions);
    
    alert('记录已保存到历史！');
  };

  const loadSession = (session: SavedGameSession) => {
    setPlayerNames(session.playerNames);
    setGameRecords(session.records);
    setSelectedSessionId(session.id);
    
    // 计算当前轮数和回合数
    if (session.records.length > 0) {
      const lastRecord = session.records[session.records.length - 1];
      setCurrentRound(lastRecord.round);
      setCurrentGame(lastRecord.game);
    }
    
    if (session.bulletStats) {
      setBulletStats(session.bulletStats);
      setShowStats(true);
    }
  };

  const getRoundDisplay = (round: number) => {
    const chineseNumbers = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return chineseNumbers[round] || round.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-4">
              Liar's Bar - 德扑计算器
            </h1>
            <p className="text-lg text-muted-foreground">
              欢迎来到充满欺骗与策略的酒吧
            </p>
          </div>
          
          {/* Main Layout: Left History + Right Table */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Side - History List */}
            <div className="lg:col-span-1">
              <Card className="bg-card border border-border h-[600px]">
                <CardHeader>
                  <CardTitle className="text-lg text-center">历史</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {savedSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => loadSession(session)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors ${
                          selectedSessionId === session.id 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-muted/30 border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="text-sm font-mono">
                          {session.date}
                        </div>
                      </button>
                    ))}
                    
                    {savedSessions.length === 0 && (
                      <div className="text-center text-muted-foreground py-12 text-sm">
                        暂无历史记录
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Game Table */}
            <div className="lg:col-span-3">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">记录表格</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[100px]">第几轮游戏</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[80px]">第几回合</th>
                          {playerNames.map((name, index) => (
                            <th key={index} className="text-left py-3 px-4 font-semibold text-foreground min-w-[120px]">
                              {editingPlayer === index ? (
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                                  onBlur={() => setEditingPlayer(null)}
                                  onKeyPress={(e) => e.key === 'Enter' && setEditingPlayer(null)}
                                  className="bg-background border border-border rounded px-2 py-1 text-sm w-full"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  onClick={() => setEditingPlayer(index)}
                                  className="cursor-pointer hover:bg-muted rounded px-2 py-1 transition-colors block"
                                >
                                  {name}
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {gameRecords.map((record, recordIndex) => (
                          <tr key={recordIndex} className="border-b border-border hover:bg-muted/30">
                            <td className="py-3 px-4 text-muted-foreground font-medium">
                              {getRoundDisplay(record.round)}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground font-medium">{record.game}</td>
                            {record.players.map((playerValue, playerIndex) => (
                              <td key={playerIndex} className="py-3 px-4">
                                {editingCell?.round === record.round && 
                                 editingCell?.game === record.game && 
                                 editingCell?.player === playerIndex ? (
                                  <input
                                    type="text"
                                    value={playerValue}
                                    onChange={(e) => handleCellEdit(record.round, record.game, playerIndex, e.target.value)}
                                    onBlur={() => setEditingCell(null)}
                                    onKeyPress={(e) => e.key === 'Enter' && setEditingCell(null)}
                                    className="bg-background border border-border rounded px-2 py-1 text-sm w-full"
                                    autoFocus
                                  />
                                ) : (
                                  <span
                                    onClick={() => setEditingCell({round: record.round, game: record.game, player: playerIndex})}
                                    className={`cursor-pointer hover:bg-muted rounded px-2 py-1 transition-colors block min-h-[24px] ${
                                      playerValue === 'Winner' 
                                        ? 'text-green-600 font-semibold' 
                                        : playerValue === 'Die' || (typeof playerValue === 'string' && playerValue.includes('Die'))
                                        ? 'text-red-600' 
                                        : 'text-foreground'
                                    }`}
                                  >
                                    {playerValue || '—'}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Statistics Display */}
                  {showStats && bulletStats.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">子弹消耗统计</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {bulletStats.map((stat, index) => (
                          <div key={index} className="bg-muted/30 rounded-lg p-4 text-center">
                            <div className="font-semibold text-foreground">{stat.name}</div>
                            <div className="text-2xl font-bold text-primary mt-1">{stat.bullets}</div>
                            <div className="text-xs text-muted-foreground">发子弹</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div className="flex justify-center gap-4 mt-8">
                    <button
                      onClick={startNewRound}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      新一轮游戏
                    </button>
                    <button
                      onClick={startNewGame}
                      className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      新一回合
                    </button>
                    <button
                      onClick={settlement}
                      className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                    >
                      结算
                    </button>
                    <button
                      onClick={saveCurrentSession}
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 