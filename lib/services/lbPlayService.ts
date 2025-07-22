import { getDatabase } from '@/lib/database';
import { LbPlay } from '@/app/types/lb_play';

export class LbPlayService {
  
  /**
   * 获取所有玩家
   */
  static async getAllPlayers(): Promise<LbPlay[]> {
    const db = await getDatabase();
    const players = await db.all('SELECT * FROM lb_play ORDER BY created_at DESC');
    return players.map(player => new LbPlay(player.id, player.name, player.icon));
  }

  /**
   * 根据ID获取玩家
   */
  static async getPlayerById(id: number): Promise<LbPlay | null> {
    const db = await getDatabase();
    const player = await db.get('SELECT * FROM lb_play WHERE id = ?', [id]);
    return player ? new LbPlay(player.id, player.name, player.icon) : null;
  }

  /**
   * 根据姓名搜索玩家
   */
  static async searchPlayersByName(name: string): Promise<LbPlay[]> {
    const db = await getDatabase();
    const players = await db.all(
      'SELECT * FROM lb_play WHERE name LIKE ? ORDER BY name',
      [`%${name}%`]
    );
    return players.map(player => new LbPlay(player.id, player.name, player.icon));
  }

  /**
   * 创建新玩家
   */
  static async createPlayer(name: string, icon?: string): Promise<LbPlay> {
    const db = await getDatabase();
    
    // 检查姓名是否已存在
    const existingPlayer = await db.get('SELECT id FROM lb_play WHERE name = ?', [name]);
    if (existingPlayer) {
      throw new Error('玩家姓名已存在');
    }

    const result = await db.run(
      'INSERT INTO lb_play (name, icon) VALUES (?, ?)',
      [name, icon || null]
    );

    const newPlayer = await db.get('SELECT * FROM lb_play WHERE id = ?', [result.lastID]);
    return new LbPlay(newPlayer.id, newPlayer.name, newPlayer.icon);
  }

  /**
   * 更新玩家信息
   */
  static async updatePlayer(id: number, name: string, icon?: string): Promise<LbPlay> {
    const db = await getDatabase();
    
    // 检查玩家是否存在
    const existingPlayer = await db.get('SELECT * FROM lb_play WHERE id = ?', [id]);
    if (!existingPlayer) {
      throw new Error('玩家不存在');
    }

    // 检查新姓名是否与其他玩家重复
    const duplicatePlayer = await db.get(
      'SELECT id FROM lb_play WHERE name = ? AND id != ?',
      [name, id]
    );
    if (duplicatePlayer) {
      throw new Error('玩家姓名已存在');
    }

    await db.run(
      'UPDATE lb_play SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, icon || null, id]
    );

    const updatedPlayer = await db.get('SELECT * FROM lb_play WHERE id = ?', [id]);
    return new LbPlay(updatedPlayer.id, updatedPlayer.name, updatedPlayer.icon);
  }

  /**
   * 删除玩家
   */
  static async deletePlayer(id: number): Promise<void> {
    const db = await getDatabase();
    
    // 检查玩家是否存在
    const existingPlayer = await db.get('SELECT * FROM lb_play WHERE id = ?', [id]);
    if (!existingPlayer) {
      throw new Error('玩家不存在');
    }

    // 检查是否有相关的游戏记录
    const recordCount = await db.get(
      `SELECT COUNT(*) as count FROM lb_record 
       WHERE player_id = ? OR player2_id = ? OR player3_id = ? OR player4_id = ?`,
      [id, id, id, id]
    );

    if (recordCount.count > 0) {
      throw new Error('该玩家有关联的游戏记录，无法删除');
    }

    await db.run('DELETE FROM lb_play WHERE id = ?', [id]);
  }

  /**
   * 检查玩家姓名是否可用
   */
  static async isNameAvailable(name: string, excludeId?: number): Promise<boolean> {
    const db = await getDatabase();
    let query = 'SELECT id FROM lb_play WHERE name = ?';
    let params: any[] = [name];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const existingPlayer = await db.get(query, params);
    return !existingPlayer;
  }
} 