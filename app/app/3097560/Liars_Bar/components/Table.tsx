"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { LbPlay } from "@/app/types/lb_play";
import { LbRecord } from "@/app/types/lb_record";
import { LbAction } from "@/app/types/lb_action_enum";

/**
 * 从 API 获取玩家列表
 * @return {Promise<{ success: boolean; data: LbPlay[] }>} 返回玩家列表
 * @throws {Error} 如果请求失败
 */
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

/**
 * 获取下一个对局 ID
 * * @return {Promise<number>} 返回下一个对局 ID
 * * @throws {Error} 如果请求失败
 */
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

/**
 * 通过 MatchId 检索记录
 * @param {number} matchId - 对局 ID
 * @return {Promise<LbRecord[]>} 返回匹配 ID 的记录列表
 * @throws {Error} 如果请求失败
 */
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

/**
 * 更新记录
 * @param {LbRecord} record - 要更新的记录
 * @return {Promise<boolean>} 返回更新是否成功
 */
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

/**
 * 创建新记录
 * @param {Partial<LbRecord>} record - 要创建的记录
 * @return {Promise<boolean>} 返回创建是否成功
 */
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

/**
 * 生成对局名 - 基于创建时间
 * @param createdAt - 记录创建时间
 * @returns {string} 返回格式化的对局名
 */
const generateMatchNameFromTime = (createdAt?: string): string => {
  const date = createdAt ? new Date(createdAt) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

interface TableProps {
  matchId: number | null;
  matchName: string;
  onNewMatch?: (matchId: number, matchName: string) => void; // 新建对局回调
}

export default function Table({ matchId, matchName, onNewMatch }: TableProps) {
  const [records, setRecords] = useState<LbRecord[]>([]);
  const [players, setPlayers] = useState<LbPlay[]>([]);

  const [showStats, setShowStats] = useState(false);
  const [bulletStats, setBulletStats] = useState<{ name: string; bullets: number; deaths: number; wins: number; chickens: number }[]>([]);

  // 对局玩家选择状态
  const [selectedPlayers, setSelectedPlayers] = useState<{
    player1: number | null;
    player2: number | null;
    player3: number | null;
    player4: number | null;
  }>({
    player1: null,
    player2: null,
    player3: null,
    player4: null,
  });

  // 判断对局是否已保存到数据库
  const isMatchSaved = records.length > 0;

  // 计算显示的对局名 - 基于第一条记录的时间或现有 matchName
  const displayMatchName = records.length > 0 
    ? generateMatchNameFromTime(records[0].created_at) 
    : matchName;

  // 加载数据
  useEffect(() => {
    if (matchId) {
      const loadRecords = async () => {
        const matchRecords = await fetchRecordsByMatchId(matchId);
        setRecords(matchRecords);
        
        if (matchRecords.length > 0) {
          // 如果有记录，计算统计数据
          calculateBulletStats(matchRecords);
          // 使用数据库中的玩家，并设置选择状态（已锁定）
          setSelectedPlayers({
            player1: matchRecords[0].playerId,
            player2: matchRecords[0].player2Id,
            player3: matchRecords[0].player3Id,
            player4: matchRecords[0].player4Id,
          });
        }
      };
      
      loadRecords();
    } else {
      setRecords([]);
      setShowStats(false);
      // 清除对局时重置玩家选择
      setSelectedPlayers({
        player1: null,
        player2: null,
        player3: null,
        player4: null,
      });
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
    const statsMap = new Map<number, { name: string; bullets: number; deaths: number; wins: number; chickens: number }>();
    
    // 收集所有玩家ID（不论存活状态）
    records.forEach(record => {
      playerIds.add(record.playerId);
      playerIds.add(record.player2Id);
      playerIds.add(record.player3Id);
      playerIds.add(record.player4Id);
    });
    
    // 初始化统计
    Array.from(playerIds).forEach(id => {
      const player = players.find(p => p.id === id);
      statsMap.set(id, { 
        name: player?.name || `玩家${id}`, 
        bullets: 0,
        deaths: 0,
        wins: 0,
        chickens: 0
      });
    });
    
    // 计算子弹数、DIE 次数、获胜次数和吃鸡次数
    records.forEach(record => {
      // 计算吃鸡 - 检查每个玩家是否在该回合吃鸡
      // 玩家1吃鸡判定
      if (record.player1Action === LbAction.WIN && !record.isPlayer2Alive && !record.isPlayer3Alive && !record.isPlayer4Alive) {
        if (statsMap.has(record.playerId)) {
          const stats = statsMap.get(record.playerId)!;
          stats.chickens += 1;
          statsMap.set(record.playerId, stats);
        }
      }
      // 玩家2吃鸡判定
      if (record.player2Action === LbAction.WIN && !record.isPlayer1Alive && !record.isPlayer3Alive && !record.isPlayer4Alive) {
        if (statsMap.has(record.player2Id)) {
          const stats = statsMap.get(record.player2Id)!;
          stats.chickens += 1;
          statsMap.set(record.player2Id, stats);
        }
      }
      // 玩家3吃鸡判定
      if (record.player3Action === LbAction.WIN && !record.isPlayer1Alive && !record.isPlayer2Alive && !record.isPlayer4Alive) {
        if (statsMap.has(record.player3Id)) {
          const stats = statsMap.get(record.player3Id)!;
          stats.chickens += 1;
          statsMap.set(record.player3Id, stats);
        }
      }
      // 玩家4吃鸡判定
      if (record.player4Action === LbAction.WIN && !record.isPlayer1Alive && !record.isPlayer2Alive && !record.isPlayer3Alive) {
        if (statsMap.has(record.player4Id)) {
          const stats = statsMap.get(record.player4Id)!;
          stats.chickens += 1;
          statsMap.set(record.player4Id, stats);
        }
      }
      
      // 计算玩家 1 的数据
      if (statsMap.has(record.playerId)) {
        const stats = statsMap.get(record.playerId)!;
        if (record.player1Count > 0) {
          stats.bullets += record.player1Count;
        }
        if (record.player1Action === LbAction.DIE) {
          stats.deaths += 1;
        }
        if (record.player1Action === LbAction.WIN) {
          stats.wins += 1;
        }
        statsMap.set(record.playerId, stats);
      }
      
      // 计算玩家 2 的数据
      if (statsMap.has(record.player2Id)) {
        const stats = statsMap.get(record.player2Id)!;
        if (record.player2Count > 0) {
          stats.bullets += record.player2Count;
        }
        if (record.player2Action === LbAction.DIE) {
          stats.deaths += 1;
        }
        if (record.player2Action === LbAction.WIN) {
          stats.wins += 1;
        }
        statsMap.set(record.player2Id, stats);
      }
      
      // 计算玩家 3 的数据
      if (statsMap.has(record.player3Id)) {
        const stats = statsMap.get(record.player3Id)!;
        if (record.player3Count > 0) {
          stats.bullets += record.player3Count;
        }
        if (record.player3Action === LbAction.DIE) {
          stats.deaths += 1;
        }
        if (record.player3Action === LbAction.WIN) {
          stats.wins += 1;
        }
        statsMap.set(record.player3Id, stats);
      }
      
      // 计算玩家 4 的数据
      if (statsMap.has(record.player4Id)) {
        const stats = statsMap.get(record.player4Id)!;
        if (record.player4Count > 0) {
          stats.bullets += record.player4Count;
        }
        if (record.player4Action === LbAction.DIE) {
          stats.deaths += 1;
        }
        if (record.player4Action === LbAction.WIN) {
          stats.wins += 1;
        }
        statsMap.set(record.player4Id, stats);
      }
    });
    
    // 转换为数组
    const stats = Array.from(statsMap.values());
    setBulletStats(stats);
    setShowStats(true);
  };

  // 获取玩家名称
  const getPlayerName = (playerId: number) => {
    return players.find(p => p.id === playerId)?.name || `玩家${playerId}`;
  };

  // 获取玩家图标
  const getPlayerIcon = (playerId: number) => {
    return players.find(p => p.id === playerId)?.icon || "";
  };

  // 处理玩家选择变化
  const handlePlayerChange = (playerPosition: 'player1' | 'player2' | 'player3' | 'player4', playerId: number) => {
    if (!isMatchSaved) {
      setSelectedPlayers(prev => ({
        ...prev,
        [playerPosition]: playerId
      }));
    }
  };

  // 获取中文轮次显示
  const getRoundDisplay = (round: number | undefined | null) => {
    if (round === undefined || round === null) {
      return "1"; // 默认值
    }
    const chineseNumbers = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
      "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", 
      "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十",
      "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九", "四十",
      "四十一", "四十二", "四十三", "四十四", "四十五", "四十六", "四十七", "四十八", "四十九", "五十"];
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
    if (!matchId) return;

    // 先保存所有记录
    const savePromises = records.map(record => updateRecord(record));
    await Promise.all(savePromises);

    try {
      // 根据是否有记录决定使用的玩家
      const playerIds = isMatchSaved && records.length > 0 
        ? {
            playerId: records[records.length - 1].playerId,
            player2Id: records[records.length - 1].player2Id,
            player3Id: records[records.length - 1].player3Id,
            player4Id: records[records.length - 1].player4Id,
          }
        : {
            playerId: selectedPlayers.player1!,
            player2Id: selectedPlayers.player2!,
            player3Id: selectedPlayers.player3!,
            player4Id: selectedPlayers.player4!,
          };

      const newRound = isMatchSaved && records.length > 0 
        ? records[records.length - 1].gameRound + 1 
        : 1;

      const newRecord: Partial<LbRecord> = {
        matchId,
        matchName,
        gameRound: newRound,
        gameTurn: 1,
        ...playerIds,
      };

      const success = await createRecord(newRecord);
      if (success) {
        // 重新加载数据
        const updatedRecords = await fetchRecordsByMatchId(matchId);
        setRecords(updatedRecords);
        // 自动结算
        if (updatedRecords.length > 0) {
          calculateBulletStats(updatedRecords);
        }
        // alert('新一轮游戏创建成功！');
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
    if (!matchId) return;

    // 先保存所有记录
    const savePromises = records.map(record => updateRecord(record));
    await Promise.all(savePromises);

    try {
      // 根据是否有记录决定使用的玩家
      const playerIds = isMatchSaved && records.length > 0 
        ? {
            playerId: records[records.length - 1].playerId,
            player2Id: records[records.length - 1].player2Id,
            player3Id: records[records.length - 1].player3Id,
            player4Id: records[records.length - 1].player4Id,
          }
        : {
            playerId: selectedPlayers.player1!,
            player2Id: selectedPlayers.player2!,
            player3Id: selectedPlayers.player3!,
            player4Id: selectedPlayers.player4!,
          };

      const gameRound = isMatchSaved && records.length > 0 
        ? records[records.length - 1].gameRound 
        : 1;
      
      const newTurn = isMatchSaved && records.length > 0 
        ? records[records.length - 1].gameTurn + 1 
        : 1;

      const newRecord: Partial<LbRecord> = {
        matchId,
        matchName,
        gameRound,
        gameTurn: newTurn,
        ...playerIds,
      };

      const success = await createRecord(newRecord);
      if (success) {
        // 重新加载数据
        const updatedRecords = await fetchRecordsByMatchId(matchId);
        setRecords(updatedRecords);
        // 自动结算
        if (updatedRecords.length > 0) {
          calculateBulletStats(updatedRecords);
        }
        // alert('新一回合创建成功！');
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
      // 使用当前时间作为对局名
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const newMatchName = `${year}-${month}-${day} ${hours}:${minutes}`;
      
      // 只创建对局，不创建记录，等待用户选择玩家
      if (onNewMatch) {
        // 初始化玩家选择为前4个玩家
        setSelectedPlayers({
          player1: players[0].id,
          player2: players[1].id,
          player3: players[2].id,
          player4: players[3].id,
        });
        onNewMatch(nextMatchId, newMatchName);
      } else {
        alert('创建新对局失败');
      }
    } catch (error) {
      console.error('创建新对局失败:', error);
      alert('创建新对局失败');
    }
  };

  // 开始游戏 - 创建第一条记录
  const handleStartGame = async () => {
    if (!matchId || !selectedPlayers.player1 || !selectedPlayers.player2 || !selectedPlayers.player3 || !selectedPlayers.player4) {
      return;
    }

    try {
      // 创建初始记录，使用选择的玩家
      const initialRecord: Partial<LbRecord> = {
        matchId,
        matchName,
        gameRound: 1,
        gameTurn: 1,
        playerId: selectedPlayers.player1,
        player2Id: selectedPlayers.player2,
        player3Id: selectedPlayers.player3,
        player4Id: selectedPlayers.player4,
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
      if (success) {
        // 重新加载数据
        const updatedRecords = await fetchRecordsByMatchId(matchId);
        setRecords(updatedRecords);
        // 自动结算
        if (updatedRecords.length > 0) {
          calculateBulletStats(updatedRecords);
        }
        alert('游戏开始成功！');
      } else {
        alert('开始游戏失败');
      }
    } catch (error) {
      console.error('开始游戏失败:', error);
      alert('开始游戏失败');
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
      case LbAction.DIE: return 'bg-red-50';
      case LbAction.GOD_SAVED: return 'bg-yellow-50';
      case LbAction.WIN: return 'bg-green-50';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 游戏对局记录表格 */}
      <Card className="bg-card border border-border">
        <CardHeader>
          <h2 className="text-2xl text-center">
            {displayMatchName || "请选择对局"}
            {matchId && <span className="text-xs text-muted-foreground ml-2">ID: {matchId}</span>}
          </h2>
        </CardHeader>
        <CardContent>
        {matchId ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-center py-3 px-4 font-bold text-foreground min-w-[100px]">游戏轮数</th>
                    <th className="text-center py-3 px-4 font-bold text-foreground min-w-[80px]">回合数</th>
                                        <th className="text-center py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {isMatchSaved && records.length > 0 ? (
                        <>
                          {getPlayerIcon(records[0].playerId)} {getPlayerName(records[0].playerId)}
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Select
                            value={selectedPlayers.player1?.toString() || ""}
                            onValueChange={(value) => handlePlayerChange('player1', parseInt(value))}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="选择" />
                            </SelectTrigger>
                            <SelectContent>
                              {players.map((player) => (
                                <SelectItem key={player.id} value={player.id.toString()}>
                                  {player.icon} {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </th>
                                        <th className="text-center py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {isMatchSaved && records.length > 0 ? (
                        <>
                          {getPlayerIcon(records[0].player2Id)} {getPlayerName(records[0].player2Id)}
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Select
                            value={selectedPlayers.player2?.toString() || ""}
                            onValueChange={(value) => handlePlayerChange('player2', parseInt(value))}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="选择" />
                            </SelectTrigger>
                            <SelectContent>
                              {players.map((player) => (
                                <SelectItem key={player.id} value={player.id.toString()}>
                                  {player.icon} {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </th>
                                        <th className="text-center py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {isMatchSaved && records.length > 0 ? (
                        <>
                          {getPlayerIcon(records[0].player3Id)} {getPlayerName(records[0].player3Id)}
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Select
                            value={selectedPlayers.player3?.toString() || ""}
                            onValueChange={(value) => handlePlayerChange('player3', parseInt(value))}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="选择" />
                            </SelectTrigger>
                            <SelectContent>
                              {players.map((player) => (
                                <SelectItem key={player.id} value={player.id.toString()}>
                                  {player.icon} {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </th>
                                        <th className="text-center py-3 px-4 font-semibold text-foreground min-w-[120px]">
                      {isMatchSaved && records.length > 0 ? (
                        <>
                          {getPlayerIcon(records[0].player4Id)} {getPlayerName(records[0].player4Id)}
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <Select
                            value={selectedPlayers.player4?.toString() || ""}
                            onValueChange={(value) => handlePlayerChange('player4', parseInt(value))}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="选择" />
                            </SelectTrigger>
                            <SelectContent>
                              {players.map((player) => (
                                <SelectItem key={player.id} value={player.id.toString()}>
                                  {player.icon} {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 ? records.map((record, recordIndex) => (
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
                          {/* 如果这行其他玩家都死亡的话，添加 👑 徽章 */}
                          {!record.isPlayer2Alive && !record.isPlayer3Alive && !record.isPlayer4Alive && record.player1Action === LbAction.WIN &&
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-yellow-200">👑</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>本轮吃鸡</p>
                              </TooltipContent>
                            </Tooltip>
                          }
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
                          {/* 如果这行其他玩家都死亡的话，添加 👑 徽章 */}
                          {!record.isPlayer1Alive && !record.isPlayer3Alive && !record.isPlayer4Alive && record.player2Action === LbAction.WIN &&
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-yellow-200">👑</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>本轮吃鸡</p>
                              </TooltipContent>
                            </Tooltip>
                          }
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
                          {/* 如果这行其他玩家都死亡的话，添加 👑 徽章 */}
                          {!record.isPlayer1Alive && !record.isPlayer2Alive && !record.isPlayer4Alive && record.player3Action === LbAction.WIN &&
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-yellow-200">👑</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>本轮吃鸡</p>
                              </TooltipContent>
                            </Tooltip>
                          }
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
                          {/* 如果这行其他玩家都死亡的话，添加 👑 徽章 */}
                          {!record.isPlayer1Alive && !record.isPlayer2Alive && !record.isPlayer3Alive && record.player4Action === LbAction.WIN &&
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge className="bg-yellow-200">👑</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>本轮吃鸡</p>
                              </TooltipContent>
                            </Tooltip>
                          }
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <div className="space-y-4">
                          <p>已创建新对局，请选择玩家后开始游戏</p>
                          <button 
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:bg-green-400"
                            onClick={handleStartGame}
                            disabled={!selectedPlayers.player1 || !selectedPlayers.player2 || !selectedPlayers.player3 || !selectedPlayers.player4}
                          >
                            开始游戏
                          </button>
                          {(!selectedPlayers.player1 || !selectedPlayers.player2 || !selectedPlayers.player3 || !selectedPlayers.player4) && (
                            <p className="text-xs text-red-500 mt-2">
                              请先选择所有4个玩家
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


          </>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <div className="space-y-4">
              <p>请从左侧选择一个对局，或创建新对局</p>
              <button 
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={handleNewMatch}
                disabled={players.length < 4}
              >
                新建对局
              </button>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
      
      {/* Control Buttons */}
      {matchId && records.length > 0 && (
        <div className="flex justify-end gap-4 flex-wrap">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:bg-primary/50"
            onClick={handleNewRound}
            disabled={!isMatchSaved && (!selectedPlayers.player1 || !selectedPlayers.player2 || !selectedPlayers.player3 || !selectedPlayers.player4)}
          >
            新一轮游戏
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:bg-secondary/50"
            onClick={handleNewTurn}
            disabled={!isMatchSaved && (!selectedPlayers.player1 || !selectedPlayers.player2 || !selectedPlayers.player3 || !selectedPlayers.player4)}
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

      {/* 游戏数据统计 */}
      {showStats && bulletStats.length > 0 && (
        <Card className="bg-gray-50 border border-border">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold text-foreground text-center">游戏数据统计</h3>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {bulletStats.map((stat, index) => {
                // 根据玩家ID查找对应的图标
                const playerId = players.find(p => p.name === stat.name)?.id;
                const playerIcon = playerId ? getPlayerIcon(playerId) : '';
                
                return (
                  <Card key={index} className="bg-muted/30 border-muted">
                    <CardContent className="p-2 text-center">
                      <div className="font-semibold text-foreground mb-1">
                        {playerIcon} {stat.name}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">子弹消耗:</span>
                          <span className="text-lg font-bold text-primary">{stat.bullets}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">死亡:</span>
                          <span className="text-lg font-bold text-red-600">{stat.deaths}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">获胜:</span>
                          <span className="text-lg font-bold text-green-600">{stat.wins}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">吃鸡:</span>
                          <span className="text-lg font-bold text-yellow-600">👑 {stat.chickens}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
