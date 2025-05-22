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

    console.log('Form submitted with:', input);
    setResponse(`✅ Simulated response: "${input}"`);
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
