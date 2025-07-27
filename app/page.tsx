import Link from "next/link";
import { Github } from "lucide-react";

// Steam SVG Icon Component
const SteamIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 256 259" 
    xmlns="http://www.w3.org/2000/svg" 
    preserveAspectRatio="xMidYMid"
    fill="currentColor"
  >
    <path d="M127.779 0C60.42 0 5.24 52.412 0 119.014l68.724 28.674a35.812 35.812 0 0 1 20.426-6.366c.682 0 1.356.019 2.02.056l30.566-44.71v-.626c0-26.903 21.69-48.796 48.353-48.796 26.662 0 48.352 21.893 48.352 48.796 0 26.902-21.69 48.804-48.352 48.804-.37 0-.73-.009-1.098-.018l-43.593 31.377c.028.582.046 1.163.046 1.735 0 20.204-16.283 36.636-36.294 36.636-17.566 0-32.263-12.658-35.584-29.412L4.41 164.654c15.223 54.313 64.673 94.132 123.369 94.132 70.818 0 128.221-57.938 128.221-129.393C256 57.93 198.597 0 127.779 0zM80.352 196.332l-15.749-6.568c2.787 5.867 7.621 10.775 14.033 13.47 13.857 5.83 29.836-.803 35.612-14.799a27.555 27.555 0 0 0 .046-21.035c-2.768-6.79-7.999-12.086-14.706-14.909-6.67-2.795-13.811-2.694-20.085-.304l16.275 6.79c10.222 4.3 15.056 16.145 10.794 26.46-4.253 10.314-15.998 15.195-26.22 10.895zm121.957-100.29c0-17.925-14.457-32.52-32.217-32.52-17.769 0-32.226 14.595-32.226 32.52 0 17.926 14.457 32.512 32.226 32.512 17.76 0 32.217-14.586 32.217-32.512zm-56.37-.055c0-13.488 10.84-24.42 24.2-24.42 13.368 0 24.208 10.932 24.208 24.42 0 13.488-10.84 24.421-24.209 24.421-13.359 0-24.2-10.933-24.2-24.42z"/>
  </svg>
);

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
                      <div className="flex items-center justify-center gap-4">
              <Link 
                href="https://github.com/senjianlu/steamcopilot" 
                target="_blank"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <Github className="w-5 h-5 text-foreground" />
              </Link>
              <Link 
                href="https://steamcommunity.com/id/19970731/" 
                target="_blank"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <SteamIcon className="w-5 h-5 text-foreground" />
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
