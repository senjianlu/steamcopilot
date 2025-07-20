export default function LiarsBarPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-4">
              Liar's Bar
            </h1>
            <p className="text-lg text-muted-foreground">
              欢迎来到充满欺骗与策略的酒吧
            </p>
          </div>
          
          {/* Game Introduction */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">游戏简介</h2>
            <p className="text-muted-foreground leading-relaxed">
              Liar's Bar 是一款充满欺骗和策略的多人在线游戏。在这个神秘的酒吧中，
              玩家需要运用智慧和演技来获得胜利。游戏融合了扑克、欺骗和生存元素，
              为玩家带来紧张刺激的游戏体验。
            </p>
          </div>

          {/* Game Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">游戏特色</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  多人在线对战
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  策略与心理博弈
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  独特的酒吧氛围
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  紧张刺激的游戏节奏
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">系统要求</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Windows 10/11
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  4GB RAM
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  DirectX 11 支持
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  网络连接
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              查看游戏详情
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 