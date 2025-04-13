'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { useState } from 'react';

export const FinalForm = () => {
  const [error, setError] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    setError(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="finalAnswer" className="text-sm font-medium">
          Enter the final result
        </label>
        <Input
          id="finalAnswer"
          name="finalAnswer"
          value={finalAnswer}
          onChange={(e) => setFinalAnswer(e.target.value)}
          className={error ? 'border-destructive' : ''}
          placeholder="Final answer"
        />
        {error && (
          <p className="text-sm text-destructive">
            That doesn't look like the right answer, please try again.
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};
