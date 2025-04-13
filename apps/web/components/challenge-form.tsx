'use client';

import { createSubmission } from '@/actions/create-submission';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(1).max(50),
});

export function ChallengeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null | undefined>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await createSubmission(values.name);

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to create submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1">Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Starting...' : 'Start'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
