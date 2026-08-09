import prisma from '@/lib/prisma';
import { UserProfile } from '@/context/AuthContext';

export class CustomerService {
  /**
   * Find or create user profile in MySQL database
   */
  static async findUserByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = (email || '').trim().toLowerCase();
    try {
      if (process.env.DATABASE_URL) {
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
          include: { profile: true },
        });

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role === 'ADMIN' ? 'admin' : 'customer',
            isAdmin: user.role === 'ADMIN',
            tier: user.profile?.tier || 'Standart Müşteri',
            totalSpent: user.profile?.totalSpent || 0,
            orderCount: user.profile?.orderCount || 0,
          };
        }
      }
    } catch (e) {
      console.warn('CustomerService findUserByEmail Prisma error', e);
    }
    return null;
  }
}
