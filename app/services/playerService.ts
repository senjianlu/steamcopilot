import { LbPlay } from '@/app/types/lb_play';
import { mockLbPlayers } from '@/app/mock/data/lbPlayData';

export interface GetPlayersResponse {
  success: boolean;
  data: LbPlay[];
  message?: string;
}

/**
 * 获取所有玩家列表
 * 目前使用 mock 数据，后续会连接到 Cloudflare D1 数据库
 */
export async function getPlayers(): Promise<GetPlayersResponse> {
  try {
    // 模拟异步请求延迟
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      data: mockLbPlayers
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message: '获取玩家列表失败'
    };
  }
}

/**
 * 根据ID获取特定玩家
 */
export async function getPlayerById(id: number): Promise<{ success: boolean; data: LbPlay | null; message?: string }> {
  try {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const player = mockLbPlayers.find(p => p.id === id);
    
    if (player) {
      return {
        success: true,
        data: player
      };
    } else {
      return {
        success: false,
        data: null,
        message: '玩家不存在'
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: '获取玩家信息失败'
    };
  }
}
