'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface VibeEntry {
  id: number;
  primaryArchetype: string;
  archetypeEmoji: string;
  mood: number;
  energy: number;
  dayRating: number;
  emotion: string;
  vibeDistribution: any[];
  createdAt: string;
}

export default function HistoryPage() {
  const [vibes, setVibes] = useState<VibeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get or create session ID
    let sid = localStorage.getItem('vibes_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('vibes_session_id', sid);
    }
    setSessionId(sid);

    // Fetch vibes
    const fetchVibes = async () => {
      try {
        const response = await fetch(`/api/vibes/history?sessionId=${sid}&days=7`);
        if (response.ok) {
          const data = await response.json();
          setVibes(data.vibes || []);
        }
      } catch (error) {
        console.error('Error fetching vibes:', error);
      }
      setLoading(false);
    };

    fetchVibes();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading your history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-2">Your Vibe History</h1>
          <p className="text-lg opacity-90">Last 7 days of your energy</p>
        </div>

        {/* History List */}
        {vibes.length > 0 ? (
          <div className="space-y-4 mb-8">
            {vibes.map((vibe) => (
              <div
                key={vibe.id}
                className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{vibe.archetypeEmoji}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {vibe.primaryArchetype}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(vibe.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl">{vibe.emotion}</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-purple-100 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Mood</div>
                    <div className="text-xl font-bold text-purple-600">
                      {vibe.mood}/10
                    </div>
                  </div>
                  <div className="bg-pink-100 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Energy</div>
                    <div className="text-xl font-bold text-pink-600">
                      {vibe.energy}/10
                    </div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-600">Day</div>
                    <div className="text-xl font-bold text-orange-600">
                      {vibe.dayRating}/10
                    </div>
                  </div>
                </div>

                {/* Top Archetypes */}
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">
                    Top Vibes
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {vibe.vibeDistribution.slice(0, 3).map((arch, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <span>{arch.emoji}</span>
                        <span className="text-gray-700 font-medium">
                          {arch.percentage}%
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No vibes yet!
            </h2>
            <p className="text-gray-600 mb-6">
              Start taking the quiz to build your vibe history.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Take the Quiz →
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:shadow-lg transition"
          >
            ← Take Quiz
          </Link>
          {vibes.length > 0 && (
            <button
              onClick={() => {
                localStorage.removeItem('vibes_session_id');
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-100 text-red-900 rounded-lg font-semibold hover:bg-red-200 transition"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm">
          Track your daily energy trends. Understand your patterns.
        </p>
      </div>
    </div>
  );
}
