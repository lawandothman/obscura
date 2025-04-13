'use server';

import type { Submission } from "@/app/types/submission";
import { env } from "@/env";
import { revalidatePath } from "next/cache";

export const submitAnswer = async (submissionId: string,answer: string) => {
    const formData = new URLSearchParams();
    formData.append('answer', answer);

    const response = await fetch(`${env.API_URL}/submissions/${submissionId}/answer.`, {
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
            error: error || 'Failed to submit answer',
        }
    }

    const data = (await response.json()) as Submission;

    revalidatePath('/');
    revalidatePath(`/game/${submissionId}`);

    return {
        success: true,
        data,
    };
};