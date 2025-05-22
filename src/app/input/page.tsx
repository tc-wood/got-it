'use client';

import { useState } from 'react';

export default function InputPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      console.log('Response from API:', data);
      setResponse(data.message + ': ' + data.received);
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='data'>Enter Transcript</label>
        <textarea
          name='input'
          id='data'
          value={input}
          onChange={handleOnChange}
        />
        <button type='submit'>Submit</button>
      </form>

      {response && <p>API says: {response}</p>}
    </div>
  );
}
