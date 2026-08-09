type PrismaClient = any;

let PrismaClientClass: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaClientClass = require('@prisma/client').PrismaClient;
} catch (e) {
  PrismaClientClass = class {};
}

// Prevent multiple instances of PrismaClient in development due to Next.js HMR
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

let prismaInstance: any = null;

export function getPrismaClient(): any {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!prismaInstance) {
    if (globalForPrisma.prisma) {
      prismaInstance = globalForPrisma.prisma;
    } else {
      try {
        prismaInstance = new PrismaClientClass({
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
export const prisma = new Proxy({} as any, {
  get(_target, prop) {
    const client = getPrismaClient();
    if (!client) {
      return () => Promise.resolve(null);
    }
    return (client as any)[prop];
  },
});

export default prisma;
