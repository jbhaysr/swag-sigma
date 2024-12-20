// drizzle.config.ts

import type { Config } from 'drizzle-kit';

export default {
    dialect: 'postgresql',
    schema: './src/db/schema.ts',
    out: './drizzle',
} satisfies Config;