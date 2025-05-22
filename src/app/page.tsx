'use client';

import Image from 'next/image';
import { useState } from 'react';
import { OpenAI } from 'openai';
import { useRouter } from 'next/navigation';

export default function InputPage() {

  // initialise variables
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [host, setHost] = useState('');
  const router = useRouter();

  // handle input change
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // initialise openai
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // generate quiz
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `"You are a helpful assistant that takes a transcript and generates a 5-question quiz. The transcript is: ${input}. Please generate a quiz JSON object in the following format: {
              "title": "Quiz Title",
              "questions": [
                {
                  "question": "Question Text",
                  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                  "correctAnswer": "Correct Answer",
                  "tooltip": "Tooltip Text"
                },
                {
                  "question": "Question 2",
                  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                  "correctAnswer": "Correct Answer",
                  "tooltip": "Tooltip Text"
                },
                ...
              ]
            }`,
          },
        ],
        response_format: { type: "json_object" },
      });

      // get quiz data
      const quizData = response.choices[0].message.content;

      // if quiz data is found, set it in local storage and redirect to the quiz page
      if (quizData) {
        localStorage.setItem('quizData', quizData);
        localStorage.setItem('host', host);
        router.push('/quiz');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // show the input page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 m-4">
        <Image className="mb-4 mx-auto" src="/got-it-logo.png" alt="Got It!" width={100} height={100} />
        <h1 className="text-2xl font-bold mb-6 text-center">Got It! Manual Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="host"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="Meeting/Lecture Host Email Address..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
            />
            <textarea
              name="input"
              id="data"
              value={input}
              onChange={handleOnChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
              placeholder="Paste your meeting transcript here..."
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Quiz'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}