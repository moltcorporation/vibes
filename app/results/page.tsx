'use client';

import { useEffect, useState } from 'react';
import { VibeResults, ARCHETYPES } from '../utils/vibes';

export default function ResultsPage() {
  const [vibes, setVibes] = useState<VibeResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get vibe results from sessionStorage
    const stored = sessionStorage.getItem('vibeResults');
    if (stored) {
      setVibes(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading your vibe...</div>
      </div>
    );
  }

  if (!vibes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">No vibe data found. Take the quiz first!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-12 pt-8">
          <h1 className="text-4xl font-bold mb-2">Your Vibe Today</h1>
          <p className="text-lg opacity-90">Check out your energy breakdown</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          {/* Primary Archetype */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-4">{vibes.archetypeEmoji}</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              {vibes.vibeDistribution[0].label}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
              {vibes.archetypeDescription}
            </p>
          </div>

          {/* Vibe Distribution Chart */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Your Vibe Breakdown</h3>
            
            <div className="space-y-4">
              {vibes.vibeDistribution.map((vibe) => (
                <div key={vibe.archetype}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{vibe.emoji}</span>
                      <span className="font-semibold text-gray-900">{vibe.label}</span>
                    </div>
                    <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {vibe.percentage}%
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${vibe.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Mood</div>
              <div className="text-3xl font-bold text-purple-600">{vibes.overallMood}</div>
              <div className="text-xs text-gray-600">/10</div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Energy</div>
              <div className="text-3xl font-bold text-pink-600">{vibes.overallEnergy}</div>
              <div className="text-xs text-gray-600">/10</div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Day Rating</div>
              <div className="text-3xl font-bold text-orange-600">{vibes.overallDay}</div>
              <div className="text-xs text-gray-600">/10</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
              📸 Screenshot My Vibe
            </button>
            <button className="w-full py-3 px-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition">
              📝 Save to History
            </button>
            <a href="/" className="w-full py-3 px-4 bg-gray-50 text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition text-center">
              ↺ Take Quiz Again
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm">
          Your vibe matters. Check back tomorrow for a fresh analysis.
        </p>
      </div>
    </div>
  );
}
