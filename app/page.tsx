'use client';

import { useState } from 'react';

interface QuizAnswers {
  mood: number;
  energy: number;
  dayRating: number;
  archetype: string;
  emotion: string;
}

const EMOTIONS = [
  '😌', '😄', '🔥', '😤', '🤔', '😍', '😴', '😎', '🤯', '👽'
];

const QUESTION_STEPS = [
  {
    id: 'mood',
    label: 'What\'s your mood right now?',
    subtitle: '1 = Terrible, 10 = Amazing',
    type: 'slider',
    min: 1,
    max: 10,
  },
  {
    id: 'energy',
    label: 'How\'s your energy level?',
    subtitle: '1 = Exhausted, 10 = Unstoppable',
    type: 'slider',
    min: 1,
    max: 10,
  },
  {
    id: 'dayRating',
    label: 'Rate your day so far',
    subtitle: '1 = Rough, 10 = Incredible',
    type: 'slider',
    min: 1,
    max: 10,
  },
  {
    id: 'archetype',
    label: 'Which vibe hits different today?',
    subtitle: 'Choose your primary energy',
    type: 'buttons',
    options: [
      { value: 'chaotic', label: 'Chaotic Energy', emoji: '⚡' },
      { value: 'zen', label: 'Zen Mode', emoji: '🧘' },
      { value: 'grinding', label: 'Grinding', emoji: '💪' },
      { value: 'cozy', label: 'Cozy', emoji: '🏠' },
      { value: 'vibing', label: 'Vibing', emoji: '✨' },
      { value: 'galaxy', label: 'Galaxy Brain', emoji: '🧠' },
    ],
  },
  {
    id: 'emotion',
    label: 'Pick your vibe emoji',
    subtitle: 'Which one matches your energy?',
    type: 'emotions',
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    mood: 5,
    energy: 5,
    dayRating: 5,
    archetype: 'vibing',
    emotion: '✨',
  });
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = QUESTION_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUESTION_STEPS.length) * 100;

  const handleSliderChange = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleOptionSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleEmotionSelect = (emoji: string) => {
    setAnswers((prev) => ({
      ...prev,
      emotion: emoji,
    }));
  };

  const handleNext = () => {
    if (currentStep < QUESTION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <h1 className="text-4xl font-bold mb-2">Quiz Complete! 🎉</h1>
          <p className="text-gray-600 mb-8">Your vibe analysis is ready. Redirecting...</p>
          <div className="animate-pulse">
            <div className="inline-block text-6xl mb-4">{answers.emotion}</div>
            <p className="text-xl font-semibold text-gray-800 mb-4">
              {QUESTION_STEPS[3].options?.find((o) => o.value === answers.archetype)?.label || answers.archetype}
            </p>
            <p className="text-sm text-gray-500">Loading your vibe chart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white/30 rounded-full h-2 backdrop-blur-md">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white text-sm mt-2 text-center">
            Question {currentStep + 1} of {QUESTION_STEPS.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {currentQuestion.label}
          </h2>
          <p className="text-gray-600 mb-8">{currentQuestion.subtitle}</p>

          {/* Slider Questions */}
          {currentQuestion.type === 'slider' && (
            <div className="space-y-6">
              <input
                type="range"
                min={currentQuestion.min}
                max={currentQuestion.max}
                value={answers[currentQuestion.id as keyof QuizAnswers] as number}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {answers[currentQuestion.id as keyof QuizAnswers]}
                </div>
              </div>
            </div>
          )}

          {/* Archetype Buttons */}
          {currentQuestion.type === 'buttons' && (
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`p-4 rounded-xl font-semibold transition ${
                    answers.archetype === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="text-sm">{option.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Emotion Selection */}
          {currentQuestion.type === 'emotions' && (
            <div className="grid grid-cols-5 gap-2">
              {EMOTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmotionSelect(emoji)}
                  className={`text-4xl p-3 rounded-xl transition ${
                    answers.emotion === emoji
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 scale-125'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition"
            >
              {currentStep === QUESTION_STEPS.length - 1 ? 'See My Vibe 🌀' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/70 text-center text-sm mt-8">
          vibes™ • analyze your daily energy
        </p>
      </div>
    </div>
  );
}
