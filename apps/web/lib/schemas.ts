import { z } from 'zod';

export const submissionIdSchema = z.string().uuid('Invalid submission ID format'); 