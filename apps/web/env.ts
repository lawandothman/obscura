import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    API_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_DISABLE_SUBMISSIONS: z.string().default('false'),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DISABLE_SUBMISSIONS: process.env.NEXT_PUBLIC_DISABLE_SUBMISSIONS,
  },
});
