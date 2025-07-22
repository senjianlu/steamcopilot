import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';
import { LbPlay } from '@/app/types/lb_play';

// 确保数据库已初始化
let isInitialized = false;
async function ensureDbInitialized() {
  if (!isInitialized) {
    await initDatabase();
    isInitialized = true;
  }
}

// GET - 获取所有玩家或根据ID获取特定玩家
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 获取特定玩家
      const player = await db.get(
        'SELECT * FROM lb_play WHERE id = ?',
        [id]
      );
      
      if (!player) {
        return NextResponse.json(
          { error: '玩家不存在' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: player, success: true });
    } else {
      // 获取所有玩家
      const players = await db.all(
        'SELECT * FROM lb_play ORDER BY created_at DESC'
      );
      
      return NextResponse.json({ 
        data: players, 
        success: true,
        total: players.length 
      });
    }
  } catch (error: any) {
    console.error('获取玩家信息失败:', error);
    return NextResponse.json(
      { error: '获取玩家信息失败', details: error.message },
      { status: 500 }
    );
  }
}

// POST - 创建新玩家
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const body = await request.json();
    
    const { name, icon } = body;
    
    // 验证必需字段
    if (!name) {
      return NextResponse.json(
        { error: '玩家姓名不能为空' },
        { status: 400 }
      );
    }

    // 检查玩家姓名是否已存在
    const existingPlayer = await db.get(
      'SELECT id FROM lb_play WHERE name = ?',
      [name]
    );
    
    if (existingPlayer) {
      return NextResponse.json(
        { error: '玩家姓名已存在' },
        { status: 409 }
      );
    }

    // 插入新玩家
    const result = await db.run(
      'INSERT INTO lb_play (name, icon) VALUES (?, ?)',
      [name, icon || null]
    );

    // 获取刚创建的玩家信息
    const newPlayer = await db.get(
      'SELECT * FROM lb_play WHERE id = ?',
      [result.lastID]
    );

    return NextResponse.json({
      data: newPlayer,
      success: true,
      message: '玩家创建成功'
    }, { status: 201 });

  } catch (error: any) {
    console.error('创建玩家失败:', error);
    return NextResponse.json(
      { error: '创建玩家失败', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - 更新玩家信息
export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const body = await request.json();
    
    const { id, name, icon } = body;
    
    // 验证必需字段
    if (!id) {
      return NextResponse.json(
        { error: '玩家ID不能为空' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: '玩家姓名不能为空' },
        { status: 400 }
      );
    }

    // 检查玩家是否存在
    const existingPlayer = await db.get(
      'SELECT * FROM lb_play WHERE id = ?',
      [id]
    );
    
    if (!existingPlayer) {
      return NextResponse.json(
        { error: '玩家不存在' },
        { status: 404 }
      );
    }

    // 检查新姓名是否与其他玩家重复
    const duplicatePlayer = await db.get(
      'SELECT id FROM lb_play WHERE name = ? AND id != ?',
      [name, id]
    );
    
    if (duplicatePlayer) {
      return NextResponse.json(
        { error: '玩家姓名已存在' },
        { status: 409 }
      );
    }

    // 更新玩家信息
    await db.run(
      'UPDATE lb_play SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, icon || null, id]
    );

    // 获取更新后的玩家信息
    const updatedPlayer = await db.get(
      'SELECT * FROM lb_play WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      data: updatedPlayer,
      success: true,
      message: '玩家信息更新成功'
    });

  } catch (error: any) {
    console.error('更新玩家信息失败:', error);
    return NextResponse.json(
      { error: '更新玩家信息失败', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除玩家
export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '玩家ID不能为空' },
        { status: 400 }
      );
    }

    // 检查玩家是否存在
    const existingPlayer = await db.get(
      'SELECT * FROM lb_play WHERE id = ?',
      [id]
    );
    
    if (!existingPlayer) {
      return NextResponse.json(
        { error: '玩家不存在' },
        { status: 404 }
      );
    }

    // 检查是否有相关的游戏记录
    const recordCount = await db.get(
      `SELECT COUNT(*) as count FROM lb_record 
       WHERE player_id = ? OR player2_id = ? OR player3_id = ? OR player4_id = ?`,
      [id, id, id, id]
    );

    if (recordCount.count > 0) {
      return NextResponse.json(
        { error: '该玩家有关联的游戏记录，无法删除' },
        { status: 409 }
      );
    }

    // 删除玩家
    await db.run('DELETE FROM lb_play WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: '玩家删除成功'
    });

  } catch (error: any) {
    console.error('删除玩家失败:', error);
    return NextResponse.json(
      { error: '删除玩家失败', details: error.message },
      { status: 500 }
    );
  }
}
