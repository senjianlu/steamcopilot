import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';

// 确保数据库已初始化
let isInitialized = false;
async function ensureDbInitialized() {
  if (!isInitialized) {
    await initDatabase();
    isInitialized = true;
  }
}

// GET - 获取所有历史对局列表
export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const db = await getDatabase();

    // 通过 GROUP BY 获取唯一的对局列表，并统计每个对局的记录数
    const matches = await db.all(`
      SELECT 
        match_id,
        match_name,
        COUNT(*) as record_count,
        MIN(created_at) as first_created,
        MAX(updated_at) as last_updated
      FROM lb_record 
      GROUP BY match_id, match_name 
      ORDER BY MAX(updated_at) DESC
    `);

    return NextResponse.json({
      data: matches,
      success: true,
      total: matches.length
    });

  } catch (error: any) {
    console.error('获取历史对局失败:', error);
    return NextResponse.json(
      { error: '获取历史对局失败', details: error.message },
      { status: 500 }
    );
  }
} 