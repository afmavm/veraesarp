import prisma from '@/lib/prisma';

export interface AuditLogDTO {
  userId?: string;
  action: string;
  entity: 'Product' | 'Order' | 'Stock' | 'Coupon' | 'Cargo' | 'User';
  entityId: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
}

export class AuditService {
  /**
   * Log critical admin actions into MySQL AuditLog table
   */
  static async logAction(logData: AuditLogDTO) {
    try {
      if (process.env.DATABASE_URL) {
        return await prisma.auditLog.create({
          data: {
            userId: logData.userId,
            action: logData.action,
            entity: logData.entity,
            entityId: logData.entityId,
            oldData: logData.oldData ? (logData.oldData as any) : undefined,
            newData: logData.newData ? (logData.newData as any) : undefined,
          },
        });
      }
    } catch (e) {
      console.warn('AuditLog error', e);
    }
  }

  /**
   * Fetch recent audit logs for Admin Dashboard
   */
  static async getRecentAuditLogs(limit = 50) {
    try {
      if (process.env.DATABASE_URL) {
        return await prisma.auditLog.findMany({
          orderBy: { timestamp: 'desc' },
          take: limit,
          include: { user: true },
        });
      }
    } catch (e) {
      console.warn('Fetch audit logs error', e);
    }
    return [];
  }
}
