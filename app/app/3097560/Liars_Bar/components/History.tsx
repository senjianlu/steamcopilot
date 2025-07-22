"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryProps {
  selectedMatchId: number | null;
  onSelectMatch: (matchId: number, matchName: string) => void;
  refreshTrigger?: number; // 用于触发刷新的prop
}

interface MatchItem {
  match_id: number;
  match_name: string;
  record_count: number;
  first_created: string;
  last_updated: string;
}

// API调用函数
const fetchMatches = async (): Promise<MatchItem[]> => {
  try {
    const response = await fetch('/api/app/3097560/Liars_Bar/matches');
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};

export default function History({ selectedMatchId, onSelectMatch, refreshTrigger }: HistoryProps) {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载历史对局
  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      const matchData = await fetchMatches();
      setMatches(matchData);
      setLoading(false);
    };

    loadMatches();
  }, [refreshTrigger]); // refreshTrigger变化时重新加载

  return (
    <Card className="bg-card border border-border h-[600px]">
      <CardHeader>
        <CardTitle className="text-lg text-center">历史对局</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              加载中...
            </div>
          ) : (
            <>
              {matches.map((match) => (
                <button
                  key={match.match_id}
                  onClick={() => onSelectMatch(match.match_id, match.match_name)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    selectedMatchId === match.match_id 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">{match.match_name}</div>
                  <div className="text-xs text-muted-foreground">
                    ID: {match.match_id} • 记录数: {match.record_count}
                  </div>
                </button>
              ))}
              
              {matches.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">
                  暂无历史记录
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
