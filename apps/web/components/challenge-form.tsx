'use client';

import { createSubmission } from '@/actions/create-submission';
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
import { Loader2, Rocket } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name')
    .max(50, "That's quite a long name you got there!"),
});

export function ChallengeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await createSubmission(values.name);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <div className="absolute -inset-0.5  rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500" />
                  <div className="relative">
                    <Input
                      placeholder="Enter your name to begin the challenge"
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
                Preparing Your Challenge...
              </>
            ) : (
              <div className="tracking-widest flex items-center gap-4">
                BEGIN
                <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

