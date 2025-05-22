'use client';

import { useState } from 'react';

// hardcoded quiz data, just for now
const quizData = {
  title: "demo quiz",
  questions: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
      tooltip: "Paris is the capital and most populous city of France, located on the Seine River."
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
      tooltip: "Mars appears reddish because its surface contains iron oxide (rust), giving it a distinctive red color when viewed from Earth."
    },
    {
      id: 3,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci",
      tooltip: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It's one of the most famous paintings in the world, now displayed at the Louvre Museum in Paris."
    },
    {
      id: 4,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean",
      tooltip: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface area."
    },
    {
      id: 5,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: "Oxygen",
      tooltip: "Oxygen is represented by the chemical symbol 'O' on the periodic table. It's essential for respiration in many organisms."
    }
  ]
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(quizData.questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const handleAnswerSelect = (answer: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return quizData.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(quizData.questions.length).fill(null));
    setShowResults(false);
    setExpandedQuestions([]);
  };

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Your results...</h1>
          <div className="text-center mb-6">
            <p className="text-lg mb-2">Your score: {score} out of {quizData.questions.length}</p>
            <p className="text-xl font-bold">{percentage}%</p>
          </div>
          <div className="space-y-4 mb-6">
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="p-3 rounded border">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleQuestion(index)}>
                  <p className="font-medium">{index + 1}. {q.question}</p>
                  <div className="flex items-center">
                    <span className={selectedAnswers[index] === q.correctAnswer ? "text-green-500 font-bold mr-2" : "text-red-500 font-bold mr-2"}>
                      {selectedAnswers[index]}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${expandedQuestions.includes(index) ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expandedQuestions.includes(index) && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-300">
                    {selectedAnswers[index] !== q.correctAnswer && (
                      <p className="text-green-500 my-2">Correct answer: {q.correctAnswer}</p>
                    )}
                    {q.tooltip && (
                      <div className="mt-2 text-gray-400">
                        {q.tooltip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {percentage < 75 ? (
            <div className="text-center">
              <p className="text-lg mb-2">Hmm, you didn't score high enough to prove you've <span className="text-blue-500 font-bold">Got it!</span> Did you want to reach out to your meeting host for clarification?</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.location.href = 'https://www.microsoft.com/en-gb/microsoft-teams/log-in'}>
                Contact your meeting host
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg mb-2">Well done! You've <span className="text-blue-500 font-bold">Got it!</span> Your meeting host has been notified of your completion of the quiz.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuizQuestion = quizData.questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{quizData.title}</h1>
          <p className="text-sm font-medium">
            Question {currentQuestion + 1} of {quizData.questions.length}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl mb-4">{currentQuizQuestion.question}</h2>
          <div className="space-y-2">
            {currentQuizQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-3 rounded border ${
                  selectedAnswers[currentQuestion] === option
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`py-2 px-4 rounded ${
              currentQuestion === 0
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === null}
            className={`py-2 px-4 rounded ${
              selectedAnswers[currentQuestion] === null
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {currentQuestion === quizData.questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
