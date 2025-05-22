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
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / quizData.questions.length) * 100;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Quiz Results</h1>
          <div className="text-center mb-6">
            <p className="text-lg mb-2">Your score: {score} out of {quizData.questions.length}</p>
            <p className="text-xl font-bold">{percentage}%</p>
          </div>
          <div className="space-y-4 mb-6">
            {quizData.questions.map((q, index) => (
              <div key={q.id} className="p-3 rounded border">
                <p className="font-medium">{index + 1}. {q.question}</p>
                <p className="mt-1">
                  Your answer: <span className={selectedAnswers[index] === q.correctAnswer ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                    {selectedAnswers[index]}
                  </span>
                </p>
                {selectedAnswers[index] !== q.correctAnswer && (
                  <p className="text-green-500">Correct answer: {q.correctAnswer}</p>
                )}
                {q.tooltip && (
                  <p className="text-gray-400 mt-2">
                    <span className="font-bold">Tooltip:</span> {q.tooltip}
                  </p>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={resetQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Restart Quiz
          </button>
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
