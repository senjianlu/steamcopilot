"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 自定义样式，隐藏 number 输入框的上下调整按钮
import { cn } from "@/lib/utils";
// 使用真实的API调用
import { LbPlay } from "@/app/types/lb_play";
import { LbRecord } from "@/app/types/lb_record";
import { LbAction } from "@/app/types/lb_action_enum";

// API调用函数
const fetchPlayers = async (): Promise<{ success: boolean; data: LbPlay[] }> => {
  try {
    const response = await fetch('/api/app/3097560/Liars_Bar/lbPlay');
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    return { success: false, data: [] };
  }
};

const fetchRecordsByMatchId = async (matchId: number): Promise<LbRecord[]> => {
  try {
    const response = await fetch(`/api/app/3097560/Liars_Bar/lbRecord?matchId=${matchId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
};

const updateRecord = async (record: LbRecord): Promise<boolean> => {
  try {
    const response = await fetch('/api/app/3097560/Liars_Bar/lbRecord', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: record.uuid,
        matchId: record.matchId,
        matchName: record.matchName,
        gameRound: record.gameRound,
        gameTurn: record.gameTurn,
        playerId: record.playerId,
        player1Count: record.player1Count,
        player1Action: record.player1Action,
        isPlayer1Alive: record.isPlayer1Alive,
        player2Id: record.player2Id,
        player2Count: record.player2Count,
        player2Action: record.player2Action,
        isPlayer2Alive: record.isPlayer2Alive,
        player3Id: record.player3Id,
        player3Count: record.player3Count,
        player3Action: record.player3Action,
        isPlayer3Alive: record.isPlayer3Alive,
        player4Id: record.player4Id,
        player4Count: record.player4Count,
        player4Action: record.player4Action,
        isPlayer4Alive: record.isPlayer4Alive,
      }),
    });
    
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error updating record:', error);
    return false;
  }
};

const createRecord = async (record: Partial<LbRecord>): Promise<boolean> => {
  try {
    const response = await fetch('/api/app/3097560/Liars_Bar/lbRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId: record.matchId,
        matchName: record.matchName,
        gameRound: record.gameRound,
        gameTurn: record.gameTurn,
        playerId: record.playerId,
        player1Count: record.player1Count || 0,
        player1Action: record.player1Action || '',
        isPlayer1Alive: record.isPlayer1Alive !== undefined ? record.isPlayer1Alive : true,
        player2Id: record.player2Id,
        player2Count: record.player2Count || 0,
        player2Action: record.player2Action || '',
        isPlayer2Alive: record.isPlayer2Alive !== undefined ? record.isPlayer2Alive : true,
        player3Id: record.player3Id,
        player3Count: record.player3Count || 0,
        player3Action: record.player3Action || '',
        isPlayer3Alive: record.isPlayer3Alive !== undefined ? record.isPlayer3Alive : true,
        player4Id: record.player4Id,
        player4Count: record.player4Count || 0,
        player4Action: record.player4Action || '',
        isPlayer4Alive: record.isPlayer4Alive !== undefined ? record.isPlayer4Alive : true,
      }),
    });
    
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error('Error creating record:', error);
    return false;
  }
};

const getNextMatchId = async (): Promise<number> => {
  try {
    const response = await fetch('/api/app/3097560/Liars_Bar/matches');
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    const result = await response.json();
    const matches = result.success ? result.data : [];
    
    // 找到最大的match_id并加1，如果没有数据则从1开始
    const maxId = matches.length > 0 
      ? Math.max(...matches.map((m: any) => m.match_id)) 
      : 0;
    return maxId + 1;
  } catch (error) {
    console.error('Error getting next match ID:', error);
    return Date.now(); // 备用方案：使用时间戳
  }
};

interface TableProps {
  matchId: number | null;
  matchName: string;
  onMatchNameChange: (newName: string) => void;
  onNewMatch?: (matchId: number, matchName: string) => void; // 新建对局回调
}

export default function Table({ matchId, matchName, onMatchNameChange, onNewMatch }: TableProps) {
  const [records, setRecords] = useState<LbRecord[]>([]);
  const [players, setPlayers] = useState<LbPlay[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(matchName);
  const [showStats, setShowStats] = useState(false);
  const [bulletStats, setBulletStats] = useState<{ name: string; bullets: number }[]>([]);

  // 加载数据
  useEffect(() => {
    if (matchId) {
      const loadRecords = async () => {
        const matchRecords = await fetchRecordsByMatchId(matchId);
        setRecords(matchRecords);
        
        // 如果有记录，计算统计数据
        if (matchRecords.length > 0) {
          calculateBulletStats(matchRecords);
        }
      };
      
      loadRecords();
    } else {
      setRecords([]);
      setShowStats(false);
    }
  }, [matchId]);
  
  // 加载玩家数据
  useEffect(() => {
    const loadPlayers = async () => {
      const response = await fetchPlayers();
      if (response.success) {
        setPlayers(response.data);
      }
    };
    
    loadPlayers();
  }, []);
  
  // 计算子弹统计
  const calculateBulletStats = (records: LbRecord[]) => {
    const playerIds = new Set<number>();
    const statsMap = new Map<number, { name: string; bullets: number }>();
    
    // 收集所有玩家ID
    records.forEach(record => {
      if (record.isPlayer1Alive === 1) playerIds.add(record.playerId);
      if (record.isPlayer2Alive === 1) playerIds.add(record.player2Id);
      if (record.isPlayer3Alive === 1) playerIds.add(record.player3Id);
      if (record.isPlayer4Alive === 1) playerIds.add(record.player4Id);
    });
    
    // 初始化统计
    Array.from(playerIds).forEach(id => {
      const player = players.find(p => p.id === id);
      statsMap.set(id, { 
        name: player?.name || `玩家${id}`, 
        bullets: 0 
      });
    });
    
    // 计算子弹数
    records.forEach(record => {
      if (record.player1Count > 0 && statsMap.has(record.playerId)) {
        const stats = statsMap.get(record.playerId)!;
        stats.bullets += record.player1Count;
        statsMap.set(record.playerId, stats);
      }
      
      if (record.player2Count > 0 && statsMap.has(record.player2Id)) {
        const stats = statsMap.get(record.player2Id)!;
        stats.bullets += record.player2Count;
        statsMap.set(record.player2Id, stats);
      }
      
      if (record.player3Count > 0 && statsMap.has(record.player3Id)) {
        const stats = statsMap.get(record.player3Id)!;
        stats.bullets += record.player3Count;
        statsMap.set(record.player3Id, stats);
      }
      
      if (record.player4Count > 0 && statsMap.has(record.player4Id)) {
        const stats = statsMap.get(record.player4Id)!;
        stats.bullets += record.player4Count;
        statsMap.set(record.player4Id, stats);
      }
    });
    
    // 转换为数组
    const stats = Array.from(statsMap.values());
    setBulletStats(stats);
    setShowStats(true);
  };

  // 处理标题编辑
  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditingTitle(matchName);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };
  
  const handleTitleSave = () => {
    onMatchNameChange(editingTitle);
    setIsEditingTitle(false);
  };

  // 获取玩家名称
  const getPlayerName = (playerId: number) => {
    return players.find(p => p.id === playerId)?.name || `玩家${playerId}`;
  };

  // 获取玩家图标
  const getPlayerIcon = (playerId: number) => {
    return players.find(p => p.id === playerId)?.icon || "";
  };

  // 获取中文轮次显示
  const getRoundDisplay = (round: number | undefined | null) => {
    if (round === undefined || round === null) {
      return "1"; // 默认值
    }
    const chineseNumbers = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    return chineseNumbers[round] || round.toString();
  };

  // 处理玩家子弹数量变更
  const handleCountChange = (recordIndex: number, playerNum: number, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    if (isNaN(numValue)) return;
    
    const updatedRecords = [...records];
    const record = updatedRecords[recordIndex];
    
    // 根据玩家编号更新相应字段
    switch(playerNum) {
      case 1:
        record.player1Count = numValue;
        break;
      case 2:
        record.player2Count = numValue;
        break;
      case 3:
        record.player3Count = numValue;
        break;
      case 4:
        record.player4Count = numValue;
        break;
    }
    
    setRecords(updatedRecords);
    // 数据变更后自动结算
    if (updatedRecords.length > 0) {
      calculateBulletStats(updatedRecords);
    }
  };

  // 处理玩家行动变更
  const handleActionChange = (recordIndex: number, playerNum: number, action: string) => {
    const updatedRecords = [...records];
    const record = updatedRecords[recordIndex];
    
    // 根据玩家编号更新相应字段
    switch(playerNum) {
      case 1:
        record.player1Action = action;
        record.isPlayer1Alive = action === LbAction.DIE ? 0 : 1;
        break;
      case 2:
        record.player2Action = action;
        record.isPlayer2Alive = action === LbAction.DIE ? 0 : 1;
        break;
      case 3:
        record.player3Action = action;
        record.isPlayer3Alive = action === LbAction.DIE ? 0 : 1;
        break;
      case 4:
        record.player4Action = action;
        record.isPlayer4Alive = action === LbAction.DIE ? 0 : 1;
        break;
    }
    
    setRecords(updatedRecords);
    // 数据变更后自动结算
    if (updatedRecords.length > 0) {
      calculateBulletStats(updatedRecords);
    }
  };

  // 保存所有记录到数据库
  const handleSaveRecords = async () => {
    if (!records.length || !matchId) return;

    try {
      const savePromises = records.map(record => updateRecord(record));
      const results = await Promise.all(savePromises);
      
      const successCount = results.filter(Boolean).length;
      if (successCount === records.length) {
        alert('所有记录保存成功！');
        // 自动结算
        calculateBulletStats(records);
      } else {
        alert(`部分记录保存失败，成功保存 ${successCount}/${records.length} 条记录`);
      }
    } catch (error) {
      console.error('保存记录失败:', error);
      alert('保存记录失败，请重试');
    }
  };

  // 新一轮游戏
  const handleNewRound = async () => {
    if (!matchId || !records.length) return;

    // 获取最后一条记录作为模板
    const lastRecord = records[records.length - 1];
    const newRound = lastRecord.gameRound + 1;

    const newRecord: Partial<LbRecord> = {
      matchId,
      matchName,
      gameRound: newRound,
      gameTurn: 1,
      playerId: lastRecord.playerId,
      player2Id: lastRecord.player2Id,
      player3Id: lastRecord.player3Id,
      player4Id: lastRecord.player4Id,
    };

    try {
      const success = await createRecord(newRecord);
      if (success) {
        // 重新加载数据
        const updatedRecords = await fetchRecordsByMatchId(matchId);
        setRecords(updatedRecords);
        // 自动结算
        if (updatedRecords.length > 0) {
          calculateBulletStats(updatedRecords);
        }
        alert('新一轮游戏创建成功！');
      } else {
        alert('创建新一轮游戏失败');
      }
    } catch (error) {
      console.error('创建新一轮游戏失败:', error);
      alert('创建新一轮游戏失败');
    }
  };

  // 新一回合
  const handleNewTurn = async () => {
    if (!matchId || !records.length) return;

    // 获取最后一条记录作为模板
    const lastRecord = records[records.length - 1];
    const newTurn = lastRecord.gameTurn + 1;

    const newRecord: Partial<LbRecord> = {
      matchId,
      matchName,
      gameRound: lastRecord.gameRound,
      gameTurn: newTurn,
      playerId: lastRecord.playerId,
      player2Id: lastRecord.player2Id,
      player3Id: lastRecord.player3Id,
      player4Id: lastRecord.player4Id,
    };

    try {
      const success = await createRecord(newRecord);
      if (success) {
        // 重新加载数据
        const updatedRecords = await fetchRecordsByMatchId(matchId);
        setRecords(updatedRecords);
        // 自动结算
        if (updatedRecords.length > 0) {
          calculateBulletStats(updatedRecords);
        }
        alert('新一回合创建成功！');
      } else {
        alert('创建新一回合失败');
      }
    } catch (error) {
      console.error('创建新一回合失败:', error);
      alert('创建新一回合失败');
    }
  };



  // 新建对局
  const handleNewMatch = async () => {
    if (players.length < 4) {
      alert('请先创建至少4个玩家才能开始新对局');
      return;
    }

    try {
      // 获取下一个match_id
      const nextMatchId = await getNextMatchId();
      const newMatchName = `对局${nextMatchId}`;
      
      // 创建初始记录，使用前4个玩家
      const initialRecord: Partial<LbRecord> = {
        matchId: nextMatchId,
        matchName: newMatchName,
        gameRound: 1,
        gameTurn: 1,
        playerId: players[0].id,
        player2Id: players[1].id,
        player3Id: players[2].id,
        player4Id: players[3].id,
        player1Count: 0,
        player1Action: '',
        isPlayer1Alive: 1,
        player2Count: 0,
        player2Action: '',
        isPlayer2Alive: 1,
        player3Count: 0,
        player3Action: '',
        isPlayer3Alive: 1,
        player4Count: 0,
        player4Action: '',
        isPlayer4Alive: 1,
      };

      const success = await createRecord(initialRecord);
      if (success && onNewMatch) {
        onNewMatch(nextMatchId, newMatchName);
        alert(`新对局 "${newMatchName}" 创建成功！`);
      } else {
        alert('创建新对局失败');
      }
    } catch (error) {
      console.error('创建新对局失败:', error);
      alert('创建新对局失败');
    }
  };
  
  // 获取行动对应的图标
  const getActionIcon = (action: string) => {
    switch(action) {
      case LbAction.DIE: return '❌';
      case LbAction.GOD_SAVED: return '👼';
      case LbAction.WIN: return '✅';
      default: return '';
    }
  };
  
  // 获取行动对应的背景色样式
  const getActionBackground = (action: string) => {
    switch(action) {
      case LbAction.DIE: return 'bg-red-100';
      case LbAction.GOD_SAVED: return 'bg-yellow-100';
      case LbAction.WIN: return 'bg-green-100';
      default: return '';
    }
  };

  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        {isEditingTitle ? (
          <div className="flex items-center">
            <input
              type="text"
              value={editingTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSave}
              onKeyPress={(e) => e.key === 'Enter' && handleTitleSave()}
              className="text-2xl text-center w-full bg-background border border-border rounded px-2 py-1"
              autoFocus
            />
          </div>
        ) : (
          <h2 
            className="text-2xl text-center cursor-pointer hover:text-primary"
            onClick={handleTitleClick}
          >
            {matchName || "请选择对局"}
            {matchId && <span className="text-xs text-muted-foreground ml-2">ID: {matchId}</span>}
          </h2>
        )}
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-center py-3 px-4 font-bold text-foreground min-w-[100px]">游戏轮数</th>
                    <th className="text-center py-3 px-4 font-bold text-foreground min-w-[80px]">回合数</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {getPlayerIcon(records[0].playerId)} {getPlayerName(records[0].playerId)}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {getPlayerIcon(records[0].player2Id)} {getPlayerName(records[0].player2Id)}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {getPlayerIcon(records[0].player3Id)} {getPlayerName(records[0].player3Id)}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {getPlayerIcon(records[0].player4Id)} {getPlayerName(records[0].player4Id)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, recordIndex) => (
                    <tr key={recordIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="py-3 px-4 text-muted-foreground font-bold text-center">
                        {getRoundDisplay(record.gameRound)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-bold text-center">{record.gameTurn}</td>
                      <td className={`py-2 px-4 ${getActionBackground(record.player1Action)}`}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            className={cn("w-14 h-8 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
                            value={record.player1Count > 0 ? record.player1Count : ''}
                            onChange={(e) => handleCountChange(recordIndex, 1, e.target.value)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  className={`cursor-pointer ${record.player1Action === LbAction.DIE ? 'bg-red-200 hover:bg-red-300' : 
                                    record.player1Action === LbAction.WIN ? 'bg-green-200 hover:bg-green-300' : 
                                    record.player1Action === LbAction.GOD_SAVED ? 'bg-yellow-200 hover:bg-yellow-300' : 
                                    'bg-gray-200 hover:bg-gray-300'}`}
                                  onClick={() => {
                                    // 循环切换行动状态
                                    const actions = Object.values(LbAction);
                                    const currentIndex = actions.indexOf(record.player1Action as LbAction);
                                    const nextIndex = (currentIndex + 1) % actions.length;
                                    handleActionChange(recordIndex, 1, actions[nextIndex]);
                                  }}
                                >
                                  {record.player1Action ? getActionIcon(record.player1Action) : ' 　 '} 
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击切换状态</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                      <td className={`py-2 px-4 ${getActionBackground(record.player2Action)}`}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            className={cn("w-14 h-8 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
                            value={record.player2Count > 0 ? record.player2Count : ''}
                            onChange={(e) => handleCountChange(recordIndex, 2, e.target.value)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  className={`cursor-pointer ${record.player2Action === LbAction.DIE ? 'bg-red-200 hover:bg-red-300' : 
                                    record.player2Action === LbAction.WIN ? 'bg-green-200 hover:bg-green-300' : 
                                    record.player2Action === LbAction.GOD_SAVED ? 'bg-yellow-200 hover:bg-yellow-300' : 
                                    'bg-gray-200 hover:bg-gray-300'}`}
                                  onClick={() => {
                                    // 循环切换行动状态
                                    const actions = Object.values(LbAction);
                                    const currentIndex = actions.indexOf(record.player2Action as LbAction);
                                    const nextIndex = (currentIndex + 1) % actions.length;
                                    handleActionChange(recordIndex, 2, actions[nextIndex]);
                                  }}
                                >
                                  {record.player2Action ? getActionIcon(record.player2Action) : ' 　 '} 
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击切换状态</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                      <td className={`py-2 px-4 ${getActionBackground(record.player3Action)}`}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            className={cn("w-14 h-8 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
                            value={record.player3Count > 0 ? record.player3Count : ''}
                            onChange={(e) => handleCountChange(recordIndex, 3, e.target.value)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  className={`cursor-pointer ${record.player3Action === LbAction.DIE ? 'bg-red-200 hover:bg-red-300' : 
                                    record.player3Action === LbAction.WIN ? 'bg-green-200 hover:bg-green-300' : 
                                    record.player3Action === LbAction.GOD_SAVED ? 'bg-yellow-200 hover:bg-yellow-300' : 
                                    'bg-gray-200 hover:bg-gray-300'}`}
                                  onClick={() => {
                                    // 循环切换行动状态
                                    const actions = Object.values(LbAction);
                                    const currentIndex = actions.indexOf(record.player3Action as LbAction);
                                    const nextIndex = (currentIndex + 1) % actions.length;
                                    handleActionChange(recordIndex, 3, actions[nextIndex]);
                                  }}
                                >
                                  {record.player3Action ? getActionIcon(record.player3Action) : ' 　 '} 
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击切换状态</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                      <td className={`py-2 px-4 ${getActionBackground(record.player4Action)}`}>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="99"
                            className={cn("w-14 h-8 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
                            value={record.player4Count > 0 ? record.player4Count : ''}
                            onChange={(e) => handleCountChange(recordIndex, 4, e.target.value)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  className={`cursor-pointer ${record.player4Action === LbAction.DIE ? 'bg-red-200 hover:bg-red-300' : 
                                    record.player4Action === LbAction.WIN ? 'bg-green-200 hover:bg-green-300' : 
                                    record.player4Action === LbAction.GOD_SAVED ? 'bg-yellow-200 hover:bg-yellow-300' : 
                                    'bg-gray-200 hover:bg-gray-300'}`}
                                  onClick={() => {
                                    // 循环切换行动状态
                                    const actions = Object.values(LbAction);
                                    const currentIndex = actions.indexOf(record.player4Action as LbAction);
                                    const nextIndex = (currentIndex + 1) % actions.length;
                                    handleActionChange(recordIndex, 4, actions[nextIndex]);
                                  }}
                                >
                                  {record.player4Action ? getActionIcon(record.player4Action) : ' 　 '} 
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>点击切换状态</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
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
          </>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            {matchId ? (
              "此对局无记录数据"
            ) : (
              <div className="space-y-4">
                <p>请从左侧选择一个对局，或创建新对局</p>
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={handleNewMatch}
                  disabled={players.length < 4}
                >
                  新建对局
                </button>
                {players.length < 4 && (
                  <p className="text-xs text-red-500 mt-2">
                    需要至少4个玩家才能创建新对局
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Control Buttons */}
        {matchId && (
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button 
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={handleNewRound}
              disabled={!records.length}
            >
              新一轮游戏
            </button>
            <button 
              className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              onClick={handleNewTurn}
              disabled={!records.length}
            >
              新一回合
            </button>

            <button 
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              onClick={handleSaveRecords}
              disabled={!records.length}
            >
              保存
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
