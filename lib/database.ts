import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    // 在生产环境中，数据库文件应该存储在持久化目录
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'steamcopilot.db');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // 启用外键约束
    await db.exec('PRAGMA foreign_keys = ON;');
    
    console.log('数据库连接已建立');
    return db;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    console.log('数据库连接已关闭');
  }
}

// 数据库初始化函数
export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  
  try {
    // 读取并执行初始化SQL
    const fs = require('fs').promises;
    const initSql = await fs.readFile(path.join(process.cwd(), 'data', 'init.sql'), 'utf8');
    await database.exec(initSql);
    console.log('数据库初始化完成');
  } catch (error: any) {
    // 如果表已存在，忽略错误
    if (!error.message?.includes('already exists')) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }
} 