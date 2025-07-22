"use client";

import { useState } from "react";
import History from "./components/History";
import Table from "./components/Table";

export default function LiarsBarPage() {
  const [currentMatchId, setCurrentMatchId] = useState<number | null>(null);
  const [currentMatchName, setCurrentMatchName] = useState<string>("请选择对局");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // 处理选择对局
  const handleSelectMatch = (matchId: number, matchName: string) => {
    setCurrentMatchId(matchId);
    setCurrentMatchName(matchName);
  };

  // 处理对局名称变更
  const handleMatchNameChange = (newName: string) => {
    setCurrentMatchName(newName);
  };

  // 处理新建对局
  const handleNewMatch = (matchId: number, matchName: string) => {
    setCurrentMatchId(matchId);
    setCurrentMatchName(matchName);
    // 触发History组件刷新
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tighter text-foreground mb-4">
              Liar's Bar - 德扑计算器
            </h1>
            <p className="text-lg text-muted-foreground">
              欢迎来到充满欺骗与策略的酒吧
            </p>
          </div>
          
          {/* Main Layout: Left History + Right Table */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Side - History List */}
            <div className="lg:col-span-1">
              <History
                selectedMatchId={currentMatchId}
                onSelectMatch={handleSelectMatch}
                refreshTrigger={refreshTrigger}
              />
            </div>

            {/* Right Side - Game Table */}
            <div className="lg:col-span-3">
              <Table
                matchId={currentMatchId}
                matchName={currentMatchName}
                onMatchNameChange={handleMatchNameChange}
                onNewMatch={handleNewMatch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 