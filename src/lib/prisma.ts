import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of PrismaClient in development due to Next.js HMR
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!prismaInstance) {
    if (globalForPrisma.prisma) {
      prismaInstance = globalForPrisma.prisma;
    } else {
      try {
        prismaInstance = new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        if (process.env.NODE_ENV !== 'production') {
          globalForPrisma.prisma = prismaInstance;
        }
      } catch (e) {
        console.warn('PrismaClient initialization skipped or postponed:', e);
        return null;
      }
    }
  }
  return prismaInstance;
}

// Proxy wrapper for backward compatibility
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      throw new Error('DATABASE_URL is not configured or Prisma is not initialized.');
    }
    return (client as any)[prop];
  },
});

export default prisma;
