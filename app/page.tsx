import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-4">
            Steam Copilot
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Steam 游戏助手，发现并探索精彩的游戏世界
          </p>
        </div>

        {/* Game Card */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="border border-border hover:shadow-lg transition-all duration-200 bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm">
              <div className="px-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-muted rounded-lg">
                  <span className="text-2xl">🍺</span>
                </div>
                <h2 className="font-semibold text-center text-xl mb-2">Liar's Bar - 德扑计算器</h2>
                <p className="text-muted-foreground text-sm text-center mb-6">
                  记录玩家子弹消耗以及是否存活
                </p>
              </div>
              <div className="px-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    多人在线对战
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    策略与心理博弈
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    独特的酒吧氛围
                  </div>
                </div>
                <Link 
                  href="/app/3097560/Liars_Bar" 
                  target="_blank"
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  进入德扑计算器
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-muted-foreground">
            更多游戏内容即将到来
          </p>
        </div>
      </div>
    </div>
  );
}
