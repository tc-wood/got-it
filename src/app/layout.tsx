'use client';

import { useState } from 'react';

export default function InputPage() {
  const [input, setInput] = useState('');

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    console.log('User typing:', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitted transcript:', input);
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
    </div>
  );
}
