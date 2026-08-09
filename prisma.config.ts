import { defineConfig } from '@prisma/config';
import fs from 'fs';
import path from 'path';

// Parse .env file manually if process.env.DATABASE_URL is missing
function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (e) {}

  return 'mysql://ver2bfarpcom_veradb:Veraesarp.25@localhost:3306/ver2bfarpcom_veradb?connect_timeout=30';
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
