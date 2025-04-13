'use server';

import { env } from '@/env';
import { revalidatePath } from 'next/cache';

export async function createSubmission(name: string) {
  try {
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
      throw new Error(error || 'Failed to create submission');
    }

    const data = await response.json();

    revalidatePath('/');

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create submission',
    };
  }
}
