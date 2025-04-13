'use server';

import { env } from '@/env';
import { redirect } from 'next/navigation';

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
      throw new Error('Failed to create submission');
    }

    // Redirect to game page on success
    redirect('/game');
  } catch (error) {
    throw new Error('Failed to create submission');
  }
}
