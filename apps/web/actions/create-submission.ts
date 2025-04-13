'use server';

import type { Submission } from '@/app/types/submission';
import { env } from '@/env';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createSubmission(name: string) {
  const formData = new URLSearchParams();
  formData.append('name', name);

  const response = await fetch(`${env.API_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    return {
      success: false,
      error: error || 'Failed to create submission',
    };
  }

  const data = (await response.json()) as Submission;
  revalidatePath('/');
  redirect(`/game/${data.id}`);
}
