'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizPage() {

    // initialise variables
    const router = useRouter();
    const [quizData, setQuizData] = useState<any>({});
    const [storedHost, setStoredHost] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
    const [emailSent, setEmailSent] = useState(false);
    const [participantEmail, setParticipantEmail] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [percentage, setPercentage] = useState(0);

    // get quiz data from local storage
    useEffect(() => {
        const storedQuizData = localStorage.getItem('quizData');
        const storedHost = localStorage.getItem('host');
        const storedParticipantEmail = localStorage.getItem('participantEmail');

        // if host is found, set it in the state
        if (storedHost) {
            setStoredHost(storedHost);
        }

        // if participant email is found, set it in the state
        if (storedParticipantEmail) {
            setParticipantEmail(storedParticipantEmail);
        }

        // if quiz data is found and in the right format, parse it and set the quiz data
        if (storedQuizData) {
            try {
                const parsedData = JSON.parse(storedQuizData);
                setQuizData(parsedData);
                setSelectedAnswers(Array(parsedData.questions.length).fill(null));
            } catch (error) {
                console.error('Error parsing quiz data:', error);
                router.push('/');
            }
        }
    }, [router]);

    // handle answer selection
    const handleAnswerSelect = (answer: string) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[currentQuestion] = answer;
        setSelectedAnswers(newSelectedAnswers);
    };

    // send email notification
    const sendEmailNotification = useCallback(async (score: number, percentage: number) => {
        if (!storedHost || emailSent) return;
    
        try {
            const success = percentage >= 75;
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hostEmail: storedHost,
                    participantEmail: participantEmail || 'Anonymous Participant',
                    quizTitle: quizData.title,
                    success: success
                }),
            });
    
            if (response.ok) {
                setEmailSent(true);
            } else {
                console.error('Failed to send email notification');
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    }, [storedHost, quizData, participantEmail, emailSent]);

    // handle next question
    const handleNext = () => {
        if (currentQuestion < quizData.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    // handle previous question
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // calculate score
    const calculateScore = () => {
        return quizData.questions.reduce((score: number, question: any, index: number) => {
            return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
        }, 0);
    };

    // toggle question expansion
    const toggleQuestion = (index: number) => {
        setExpandedQuestions(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Update score and percentage when showResults changes
    useEffect(() => {
        if (showResults) {
            const calculatedScore = calculateScore();
            const calculatedPercentage = (calculatedScore / quizData.questions.length) * 100;
            setScore(calculatedScore);
            setPercentage(calculatedPercentage);
            
            // Send email notification here, after score calculation
            if (!emailSent) {
                sendEmailNotification(calculatedScore, calculatedPercentage);
            }
        }
    }, [showResults, quizData.questions?.length, emailSent, sendEmailNotification]);

    // if quiz data is not loaded yet, show loading
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4 text-center">
                    <p>Loading quiz...</p>
                </div>
            </div>
        );
    }

    // when the user has finished the quiz, show the results
    if (showResults) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
                    <Image className="mb-4 mx-auto" src="/got-it-logo.png" alt="Got It!" width={100} height={100} />
                    <h1 className="text-2xl font-bold mb-6 text-center">Your results...</h1>
                    <div className="text-center mb-6">
                        <p className="text-lg mb-2">Your score: {score} out of {quizData.questions.length} <span className="text-blue-400 font-bold">{percentage}%</span></p>
                    </div>
                    <div className="space-y-4 mb-6">
                        {quizData.questions.map((q: any, index: number) => (
                            <div key={index} className="p-3 rounded border">
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
                            <p className="text-lg mb-2">Hmm, you didn't score high enough to prove you've <span className="text-blue-500 font-bold">Got it!</span> We've sent your meeting host an email to reach out to you for clarification.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg mb-2">Well done! You've <span className="text-blue-500 font-bold">Got it!</span> Your meeting host, <span className="text-blue-500 font-bold">{storedHost}</span>, has been notified of your completion of the quiz.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // get the current quiz question
    const currentQuizQuestion = quizData.questions[currentQuestion];

    // show the quiz page
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <Image src="/got-it-logo.png" alt="Got It!" width={100} height={100} />
                    <h1 className="text-2xl font-bold">{quizData.title}</h1>
                    <p className="text-sm font-medium">
                        Question {currentQuestion + 1} of {quizData.questions.length}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl mb-4">{currentQuizQuestion.question}</h2>
                    <div className="space-y-2">
                        {currentQuizQuestion.options.map((option: string, index: number) => (
                            <button
                                key={index}
                                className={`w-full text-left p-3 rounded border ${selectedAnswers[currentQuestion] === option
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
                        className={`py-2 px-4 rounded ${currentQuestion === 0
                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                            }`}
                    >
                        Previous
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion] === null}
                        className={`py-2 px-4 rounded ${selectedAnswers[currentQuestion] === null
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