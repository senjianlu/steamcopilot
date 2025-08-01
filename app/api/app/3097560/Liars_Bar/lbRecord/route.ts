import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';
import { LbRecord } from '@/app/types/lb_record';
import { randomUUID } from 'crypto';

// 确保数据库已初始化
let isInitialized = false;
async function ensureDbInitialized() {
  if (!isInitialized) {
    await initDatabase();
    isInitialized = true;
  }
}

// GET - 获取游戏记录
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    const matchId = searchParams.get('matchId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (uuid) {
      // 获取特定记录
      const record = await db.get(
        'SELECT * FROM lb_record WHERE uuid = ?',
        [uuid]
      );
      
      if (!record) {
        return NextResponse.json(
          { error: '游戏记录不存在' },
          { status: 404 }
        );
      }

      // 将数据库的snake_case字段名转换为camelCase
      const camelCaseRecord = {
        uuid: record.uuid,
        matchId: record.match_id,
        matchName: record.match_name,
        gameRound: record.game_round,
        gameTurn: record.game_turn,
        playerId: record.player_id,
        player1Count: record.player1_count,
        player1Action: record.player1_action,
        isPlayer1Alive: record.is_player1_alive,
        player2Id: record.player2_id,
        player2Count: record.player2_count,
        player2Action: record.player2_action,
        isPlayer2Alive: record.is_player2_alive,
        player3Id: record.player3_id,
        player3Count: record.player3_count,
        player3Action: record.player3_action,
        isPlayer3Alive: record.is_player3_alive,
        player4Id: record.player4_id,
        player4Count: record.player4_count,
        player4Action: record.player4_action,
        isPlayer4Alive: record.is_player4_alive,
        created_at: record.created_at,
        updated_at: record.updated_at
      };
      
      return NextResponse.json({ data: camelCaseRecord, success: true });
    } else if (matchId) {
      // 获取特定比赛的所有记录
      const records = await db.all(
        `SELECT * FROM lb_record 
         WHERE match_id = ? 
         ORDER BY game_round, game_turn, created_at 
         LIMIT ? OFFSET ?`,
        [matchId, limit, offset]
      );

      const totalCount = await db.get(
        'SELECT COUNT(*) as count FROM lb_record WHERE match_id = ?',
        [matchId]
      );

      // 将数据库的snake_case字段名转换为camelCase
      const camelCaseRecords = records.map(record => ({
        uuid: record.uuid,
        matchId: record.match_id,
        matchName: record.match_name,
        gameRound: record.game_round,
        gameTurn: record.game_turn,
        playerId: record.player_id,
        player1Count: record.player1_count,
        player1Action: record.player1_action,
        isPlayer1Alive: record.is_player1_alive,
        player2Id: record.player2_id,
        player2Count: record.player2_count,
        player2Action: record.player2_action,
        isPlayer2Alive: record.is_player2_alive,
        player3Id: record.player3_id,
        player3Count: record.player3_count,
        player3Action: record.player3_action,
        isPlayer3Alive: record.is_player3_alive,
        player4Id: record.player4_id,
        player4Count: record.player4_count,
        player4Action: record.player4_action,
        isPlayer4Alive: record.is_player4_alive,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));
      
      return NextResponse.json({ 
        data: camelCaseRecords, 
        success: true,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      });
    } else {
      // 获取所有记录
      const records = await db.all(
        `SELECT * FROM lb_record 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const totalCount = await db.get('SELECT COUNT(*) as count FROM lb_record');

      // 将数据库的snake_case字段名转换为camelCase
      const camelCaseRecords = records.map(record => ({
        uuid: record.uuid,
        matchId: record.match_id,
        matchName: record.match_name,
        gameRound: record.game_round,
        gameTurn: record.game_turn,
        playerId: record.player_id,
        player1Count: record.player1_count,
        player1Action: record.player1_action,
        isPlayer1Alive: record.is_player1_alive,
        player2Id: record.player2_id,
        player2Count: record.player2_count,
        player2Action: record.player2_action,
        isPlayer2Alive: record.is_player2_alive,
        player3Id: record.player3_id,
        player3Count: record.player3_count,
        player3Action: record.player3_action,
        isPlayer3Alive: record.is_player3_alive,
        player4Id: record.player4_id,
        player4Count: record.player4_count,
        player4Action: record.player4_action,
        isPlayer4Alive: record.is_player4_alive,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));
      
      return NextResponse.json({ 
        data: camelCaseRecords, 
        success: true,
        pagination: {
          page,
          limit,
          total: totalCount.count,
          totalPages: Math.ceil(totalCount.count / limit)
        }
      });
    }
  } catch (error: any) {
    console.error('获取游戏记录失败:', error);
    return NextResponse.json(
      { error: '获取游戏记录失败', details: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建新游戏记录
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const body = await request.json();
    
    const {
      matchId, matchName, gameRound, gameTurn,
      playerId, player1Count, player1Action, isPlayer1Alive,
      player2Id, player2Count, player2Action, isPlayer2Alive,
      player3Id, player3Count, player3Action, isPlayer3Alive,
      player4Id, player4Count, player4Action, isPlayer4Alive
    } = body;
    
    // 验证必需字段
    if (!matchId || !matchName || !playerId || !player2Id || !player3Id || !player4Id) {
      return NextResponse.json(
        { error: '缺少必需字段' },
        { status: 400 }
      );
    }

    // 验证玩家是否存在
    const playerIds = [playerId, player2Id, player3Id, player4Id];
    for (const id of playerIds) {
      const player = await db.get('SELECT id FROM lb_play WHERE id = ?', [id]);
      if (!player) {
        return NextResponse.json(
          { error: `玩家ID ${id} 不存在` },
          { status: 400 }
        );
      }
    }

    // 生成UUID
    const recordUuid = randomUUID();

    // 插入新记录
    await db.run(
      `INSERT INTO lb_record (
        uuid, match_id, match_name, game_round, game_turn,
        player_id, player1_count, player1_action, is_player1_alive,
        player2_id, player2_count, player2_action, is_player2_alive,
        player3_id, player3_count, player3_action, is_player3_alive,
        player4_id, player4_count, player4_action, is_player4_alive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recordUuid, matchId, matchName, gameRound || 1, gameTurn || 1,
        playerId, player1Count || 0, player1Action || '', isPlayer1Alive === false ? 0 : 1,
        player2Id, player2Count || 0, player2Action || '', isPlayer2Alive === false ? 0 : 1,
        player3Id, player3Count || 0, player3Action || '', isPlayer3Alive === false ? 0 : 1,
        player4Id, player4Count || 0, player4Action || '', isPlayer4Alive === false ? 0 : 1
      ]
    );

    // 获取刚创建的记录
    const newRecord = await db.get(
      'SELECT * FROM lb_record WHERE uuid = ?',
      [recordUuid]
    );

    // 将数据库的snake_case字段名转换为camelCase
    const camelCaseNewRecord = {
      uuid: newRecord.uuid,
      matchId: newRecord.match_id,
      matchName: newRecord.match_name,
      gameRound: newRecord.game_round,
      gameTurn: newRecord.game_turn,
      playerId: newRecord.player_id,
      player1Count: newRecord.player1_count,
      player1Action: newRecord.player1_action,
      isPlayer1Alive: newRecord.is_player1_alive,
      player2Id: newRecord.player2_id,
      player2Count: newRecord.player2_count,
      player2Action: newRecord.player2_action,
      isPlayer2Alive: newRecord.is_player2_alive,
      player3Id: newRecord.player3_id,
      player3Count: newRecord.player3_count,
      player3Action: newRecord.player3_action,
      isPlayer3Alive: newRecord.is_player3_alive,
      player4Id: newRecord.player4_id,
      player4Count: newRecord.player4_count,
      player4Action: newRecord.player4_action,
      isPlayer4Alive: newRecord.is_player4_alive,
      created_at: newRecord.created_at,
      updated_at: newRecord.updated_at
    };

    return NextResponse.json({
      data: camelCaseNewRecord,
      success: true,
      message: '游戏记录创建成功'
    }, { status: 201 });

  } catch (error: any) {
    console.error('创建游戏记录失败:', error);
    return NextResponse.json(
      { error: '创建游戏记录失败', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - 更新游戏记录
export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const body = await request.json();
    
    const {
      uuid, matchId, matchName, gameRound, gameTurn,
      playerId, player1Count, player1Action, isPlayer1Alive,
      player2Id, player2Count, player2Action, isPlayer2Alive,
      player3Id, player3Count, player3Action, isPlayer3Alive,
      player4Id, player4Count, player4Action, isPlayer4Alive
    } = body;
    
    // 验证必需字段
    if (!uuid) {
      return NextResponse.json(
        { error: '记录UUID不能为空' },
        { status: 400 }
      );
    }

    // 检查记录是否存在
    const existingRecord = await db.get(
      'SELECT * FROM lb_record WHERE uuid = ?',
      [uuid]
    );
    
    if (!existingRecord) {
      return NextResponse.json(
        { error: '游戏记录不存在' },
        { status: 404 }
      );
    }

    // 验证玩家是否存在（如果提供了新的玩家ID）
    const playerIds = [playerId, player2Id, player3Id, player4Id].filter(Boolean);
    for (const id of playerIds) {
      const player = await db.get('SELECT id FROM lb_play WHERE id = ?', [id]);
      if (!player) {
        return NextResponse.json(
          { error: `玩家ID ${id} 不存在` },
          { status: 400 }
        );
      }
    }

    // 更新记录
    await db.run(
      `UPDATE lb_record SET 
        match_id = COALESCE(?, match_id),
        match_name = COALESCE(?, match_name),
        game_round = COALESCE(?, game_round),
        game_turn = COALESCE(?, game_turn),
        player_id = COALESCE(?, player_id),
        player1_count = COALESCE(?, player1_count),
        player1_action = COALESCE(?, player1_action),
        is_player1_alive = COALESCE(?, is_player1_alive),
        player2_id = COALESCE(?, player2_id),
        player2_count = COALESCE(?, player2_count),
        player2_action = COALESCE(?, player2_action),
        is_player2_alive = COALESCE(?, is_player2_alive),
        player3_id = COALESCE(?, player3_id),
        player3_count = COALESCE(?, player3_count),
        player3_action = COALESCE(?, player3_action),
        is_player3_alive = COALESCE(?, is_player3_alive),
        player4_id = COALESCE(?, player4_id),
        player4_count = COALESCE(?, player4_count),
        player4_action = COALESCE(?, player4_action),
        is_player4_alive = COALESCE(?, is_player4_alive),
        updated_at = CURRENT_TIMESTAMP
      WHERE uuid = ?`,
      [
        matchId, matchName, gameRound, gameTurn,
        playerId, player1Count, player1Action, isPlayer1Alive === false ? 0 : (isPlayer1Alive === true ? 1 : null),
        player2Id, player2Count, player2Action, isPlayer2Alive === false ? 0 : (isPlayer2Alive === true ? 1 : null),
        player3Id, player3Count, player3Action, isPlayer3Alive === false ? 0 : (isPlayer3Alive === true ? 1 : null),
        player4Id, player4Count, player4Action, isPlayer4Alive === false ? 0 : (isPlayer4Alive === true ? 1 : null),
        uuid
      ]
    );

    // 获取更新后的记录
    const updatedRecord = await db.get(
      'SELECT * FROM lb_record WHERE uuid = ?',
      [uuid]
    );

    // 将数据库的snake_case字段名转换为camelCase
    const camelCaseUpdatedRecord = {
      uuid: updatedRecord.uuid,
      matchId: updatedRecord.match_id,
      matchName: updatedRecord.match_name,
      gameRound: updatedRecord.game_round,
      gameTurn: updatedRecord.game_turn,
      playerId: updatedRecord.player_id,
      player1Count: updatedRecord.player1_count,
      player1Action: updatedRecord.player1_action,
      isPlayer1Alive: updatedRecord.is_player1_alive,
      player2Id: updatedRecord.player2_id,
      player2Count: updatedRecord.player2_count,
      player2Action: updatedRecord.player2_action,
      isPlayer2Alive: updatedRecord.is_player2_alive,
      player3Id: updatedRecord.player3_id,
      player3Count: updatedRecord.player3_count,
      player3Action: updatedRecord.player3_action,
      isPlayer3Alive: updatedRecord.is_player3_alive,
      player4Id: updatedRecord.player4_id,
      player4Count: updatedRecord.player4_count,
      player4Action: updatedRecord.player4_action,
      isPlayer4Alive: updatedRecord.is_player4_alive,
      created_at: updatedRecord.created_at,
      updated_at: updatedRecord.updated_at
    };

    return NextResponse.json({
      data: camelCaseUpdatedRecord,
      success: true,
      message: '游戏记录更新成功'
    });

  } catch (error: any) {
    console.error('更新游戏记录失败:', error);
    return NextResponse.json(
      { error: '更新游戏记录失败', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除游戏记录
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const uuid = searchParams.get('uuid');
    const matchId = searchParams.get('matchId');
    
    if (uuid) {
      // 删除特定记录
      const existingRecord = await db.get(
        'SELECT * FROM lb_record WHERE uuid = ?',
        [uuid]
      );
      
      if (!existingRecord) {
        return NextResponse.json(
          { error: '游戏记录不存在' },
          { status: 404 }
        );
      }

      await db.run('DELETE FROM lb_record WHERE uuid = ?', [uuid]);

      return NextResponse.json({
        success: true,
        message: '游戏记录删除成功'
      });
    } else if (matchId) {
      // 删除整个比赛的所有记录
      const recordCount = await db.get(
        'SELECT COUNT(*) as count FROM lb_record WHERE match_id = ?',
        [matchId]
      );

      if (recordCount.count === 0) {
        return NextResponse.json(
          { error: '比赛记录不存在' },
          { status: 404 }
        );
      }

      await db.run('DELETE FROM lb_record WHERE match_id = ?', [matchId]);

      return NextResponse.json({
        success: true,
        message: `比赛记录删除成功，共删除 ${recordCount.count} 条记录`
      });
    } else {
      return NextResponse.json(
        { error: '必须提供 uuid 或 matchId 参数' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('删除游戏记录失败:', error);
    return NextResponse.json(
      { error: '删除游戏记录失败', details: error.message },
      { status: 500 }
    );
  }
} 