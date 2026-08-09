import prisma from '@/lib/prisma';

export interface StockAdjustmentDTO {
  variantId: string;
  type: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'CANCEL' | 'DAMAGE';
  quantity: number;
  notes?: string;
  createdBy?: string;
}

export class InventoryService {
  /**
   * Log a stock movement and update variant/product inventory atomically
   */
  static async recordStockMovement(data: StockAdjustmentDTO) {
    try {
      if (process.env.DATABASE_URL) {
        return await prisma.$transaction(async (tx) => {
          // Record stock movement audit log
          const movement = await tx.stockMovement.create({
            data: {
              variantId: data.variantId,
              type: data.type,
              quantity: data.quantity,
              notes: data.notes,
              createdBy: data.createdBy || 'SYSTEM',
            },
          });

          // Calculate quantity change direction
          const delta = ['PURCHASE', 'RETURN', 'CANCEL'].includes(data.type)
            ? Math.abs(data.quantity)
            : -Math.abs(data.quantity);

          // Update variant stock
          await tx.productVariant.update({
            where: { id: data.variantId },
            data: { stock: { increment: delta } },
          });

          return movement;
        });
      }
    } catch (e) {
      console.warn('Inventory record stock movement error', e);
    }
  }

  /**
   * Get stock movements for audit dashboard
   */
  static async getStockMovements(variantId?: string) {
    try {
      if (process.env.DATABASE_URL) {
        return await prisma.stockMovement.findMany({
          where: variantId ? { variantId } : undefined,
          include: { variant: { include: { product: true } } },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      }
    } catch (e) {
      console.warn('Failed to fetch stock movements from DB', e);
    }
    return [];
  }
}
