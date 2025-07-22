# Liar's Bar API 文档

本文档描述了 Liar's Bar 游戏系统的所有 API 端点。

## 📋 目录
- [玩家管理 API](#玩家管理-api)
- [游戏记录 API](#游戏记录-api)
- [数据模型](#数据模型)
- [错误处理](#错误处理)
- [使用示例](#使用示例)

## 🎮 玩家管理 API

### 基础URL
```
/api/app/3097560/Liars_Bar/lbPlay
```

### GET - 获取玩家信息

**获取所有玩家**
```http
GET /api/app/3097560/Liars_Bar/lbPlay
```

**获取特定玩家**
```http
GET /api/app/3097560/Liars_Bar/lbPlay?id=1
```

**响应示例:**
```json
{
  "data": {
    "id": 1,
    "name": "玩家一",
    "icon": "/avatars/player1.png",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "success": true
}
```

### POST - 创建新玩家

```http
POST /api/app/3097560/Liars_Bar/lbPlay
Content-Type: application/json

{
  "name": "新玩家",
  "icon": "/avatars/new_player.png"
}
```

**响应:**
```json
{
  "data": {
    "id": 5,
    "name": "新玩家",
    "icon": "/avatars/new_player.png",
    "created_at": "2024-01-01T12:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "success": true,
  "message": "玩家创建成功"
}
```

### PUT - 更新玩家信息

```http
PUT /api/app/3097560/Liars_Bar/lbPlay
Content-Type: application/json

{
  "id": 1,
  "name": "更新的玩家名",
  "icon": "/avatars/updated.png"
}
```

### DELETE - 删除玩家

```http
DELETE /api/app/3097560/Liars_Bar/lbPlay?id=1
```

## 📊 游戏记录 API

### 基础URL
```
/api/app/3097560/Liars_Bar/lbRecord
```

### GET - 获取游戏记录

**获取所有记录（分页）**
```http
GET /api/app/3097560/Liars_Bar/lbRecord?page=1&limit=20
```

**获取特定比赛的记录**
```http
GET /api/app/3097560/Liars_Bar/lbRecord?matchId=1&page=1&limit=50
```

**获取特定记录**
```http
GET /api/app/3097560/Liars_Bar/lbRecord?uuid=550e8400-e29b-41d4-a716-446655440001
```

**响应示例:**
```json
{
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "match_id": 1,
      "match_name": "晚间对局",
      "game_round": 1,
      "game_turn": 1,
      "player_id": 1,
      "player1_count": 2,
      "player1_action": "Win",
      "is_player1_alive": 1,
      "player2_id": 2,
      "player2_count": 0,
      "player2_action": "Die",
      "is_player2_alive": 0,
      "player3_id": 3,
      "player3_count": 1,
      "player3_action": "God Saved",
      "is_player3_alive": 1,
      "player4_id": 4,
      "player4_count": 0,
      "player4_action": "Die",
      "is_player4_alive": 0,
      "created_at": "2024-01-01T20:00:00.000Z",
      "updated_at": "2024-01-01T20:00:00.000Z"
    }
  ],
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "totalPages": 1
  }
}
```

### POST - 创建游戏记录

```http
POST /api/app/3097560/Liars_Bar/lbRecord
Content-Type: application/json

{
  "matchId": 1,
  "matchName": "新比赛",
  "gameRound": 1,
  "gameTurn": 1,
  "playerId": 1,
  "player1Count": 2,
  "player1Action": "Win",
  "isPlayer1Alive": true,
  "player2Id": 2,
  "player2Count": 0,
  "player2Action": "Die",
  "isPlayer2Alive": false,
  "player3Id": 3,
  "player3Count": 1,
  "player3Action": "God Saved",
  "isPlayer3Alive": true,
  "player4Id": 4,
  "player4Count": 0,
  "player4Action": "Die",
  "isPlayer4Alive": false
}
```

### PUT - 更新游戏记录

```http
PUT /api/app/3097560/Liars_Bar/lbRecord
Content-Type: application/json

{
  "uuid": "550e8400-e29b-41d4-a716-446655440001",
  "player1Count": 3,
  "player1Action": "Win"
}
```

### DELETE - 删除游戏记录

**删除单个记录**
```http
DELETE /api/app/3097560/Liars_Bar/lbRecord?uuid=550e8400-e29b-41d4-a716-446655440001
```

**删除整个比赛的记录**
```http
DELETE /api/app/3097560/Liars_Bar/lbRecord?matchId=1
```

## 📝 数据模型

### LbPlay (玩家)
```typescript
{
  id: number;           // 自增主键
  name: string;         // 玩家姓名
  icon: string | null;  // 头像路径
  created_at: string;   // 创建时间
  updated_at: string;   // 更新时间
}
```

### LbRecord (游戏记录)
```typescript
{
  uuid: string;           // UUID主键
  match_id: number;       // 比赛ID
  match_name: string;     // 比赛名称
  game_round: number;     // 游戏轮数
  game_turn: number;      // 游戏回合数
  
  // 玩家1
  player_id: number;      // 玩家1 ID
  player1_count: number;  // 子弹数
  player1_action: string; // 动作 ("Die", "Win", "God Saved")
  is_player1_alive: number; // 是否存活 (1/0)
  
  // 玩家2-4 结构相同
  player2_id: number;
  player2_count: number;
  player2_action: string;
  is_player2_alive: number;
  
  player3_id: number;
  player3_count: number;
  player3_action: string;
  is_player3_alive: number;
  
  player4_id: number;
  player4_count: number;
  player4_action: string;
  is_player4_alive: number;
  
  created_at: string;     // 创建时间
  updated_at: string;     // 更新时间
}
```

## ⚠️ 错误处理

### 错误响应格式
```json
{
  "error": "错误描述",
  "details": "详细错误信息",
  "success": false
}
```

### 常见错误代码
- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `409 Conflict`: 资源冲突（如姓名重复）
- `500 Internal Server Error`: 服务器内部错误

## 🚀 使用示例

### JavaScript/TypeScript 客户端

```typescript
// 获取所有玩家
const getPlayers = async () => {
  const response = await fetch('/api/app/3097560/Liars_Bar/lbPlay');
  const data = await response.json();
  return data.data;
};

// 创建新玩家
const createPlayer = async (name: string, icon?: string) => {
  const response = await fetch('/api/app/3097560/Liars_Bar/lbPlay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, icon }),
  });
  return response.json();
};

// 获取比赛记录
const getMatchRecords = async (matchId: number) => {
  const response = await fetch(
    `/api/app/3097560/Liars_Bar/lbRecord?matchId=${matchId}`
  );
  return response.json();
};

// 创建游戏记录
const createGameRecord = async (recordData: any) => {
  const response = await fetch('/api/app/3097560/Liars_Bar/lbRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recordData),
  });
  return response.json();
};
```

### curl 示例

```bash
# 获取所有玩家
curl -X GET "http://localhost:3000/api/app/3097560/Liars_Bar/lbPlay"

# 创建新玩家
curl -X POST "http://localhost:3000/api/app/3097560/Liars_Bar/lbPlay" \
  -H "Content-Type: application/json" \
  -d '{"name": "测试玩家", "icon": "/avatars/test.png"}'

# 获取特定比赛的记录
curl -X GET "http://localhost:3000/api/app/3097560/Liars_Bar/lbRecord?matchId=1"

# 删除游戏记录
curl -X DELETE "http://localhost:3000/api/app/3097560/Liars_Bar/lbRecord?uuid=your-uuid-here"
```

## 🔧 开发注意事项

1. **数据库初始化**: 首次调用API时会自动执行数据库初始化
2. **UUID生成**: 使用Node.js内置的`crypto.randomUUID()`
3. **数据验证**: 所有API都包含完整的输入验证
4. **关联完整性**: 删除玩家时会检查是否有关联的游戏记录
5. **分页支持**: 游戏记录API支持分页查询
6. **错误处理**: 统一的错误响应格式和状态码

---

*本文档随API更新而更新。如有疑问，请查看源代码或联系开发团队。* 