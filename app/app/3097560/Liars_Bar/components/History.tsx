"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllMatches } from '@/app/mock/data/lbRecordData';

interface HistoryProps {
  selectedMatchId: number | null;
  onSelectMatch: (matchId: number, matchName: string) => void;
}

export default function History({ selectedMatchId, onSelectMatch }: HistoryProps) {
  // 获取所有对局
  const matches = getAllMatches();

  return (
    <Card className="bg-card border border-border h-[600px]">
      <CardHeader>
        <CardTitle className="text-lg text-center">历史对局</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match.id, match.name)}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                selectedMatchId === match.id 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <div className="text-sm font-medium mb-1">{match.name}</div>
              <div className="text-xs text-muted-foreground">ID: {match.id}</div>
            </button>
          ))}
          
          {matches.length === 0 && (
            <div className="text-center text-muted-foreground py-12 text-sm">
              暂无历史记录
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
