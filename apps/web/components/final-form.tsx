'use client';

import { submitAnswer } from '@/actions/submit-answer';
import { Button } from '@workspace/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
  zodResolver,
} from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import Confetti from 'js-confetti';
import { Loader2, Rocket } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  answer: z
    .string()
    .min(1, 'Please enter your answer')
    .refine((val) => !Number.isNaN(Number(val)), 'Answer must be a number'),
});

export function SubmitAnswerForm({ submissionId }: { submissionId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await submitAnswer(submissionId, values.answer);

    if (result.error) {
      form.setError('answer', { message: '❌ That is not the correct answer. Please try again.' });
    }

    if (result.success) {
      const confetti = new Confetti();
      confetti.addConfetti({
        confettiNumber: 750,
        confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
      });
    }

    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500" />
                  <div className="relative">
                    <Input
                      placeholder="Enter your answer"
                      className="h-14 bg-background/50 backdrop-blur-sm border-lottie-pink/20 focus:border-lottie-pink/50 focus:ring-lottie-pink/30 text-lg placeholder:text-muted-foreground/70 transition-all duration-300"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="ml-2 mt-2" />
            </FormItem>
          )}
        />

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[rgb(242,95,154)] to-[rgb(242,95,154)]/50 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <Button
            type="submit"
            className="relative w-full h-16 text-xl font-semibold bg-lottie-pink hover:bg-lottie-pink/90 text-white transition-all duration-300 group flex items-center justify-center gap-3 cursor-pointer rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Submitting...
              </>
            ) : (
              <div className="tracking-widest flex items-center gap-4">
                SUBMIT
                <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
