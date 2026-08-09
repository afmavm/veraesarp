import prisma from '@/lib/prisma';
import { CargoCarrier } from '@/components/admin/AdminCargoSettings';

const DEFAULT_CARGO_CARRIERS: CargoCarrier[] = [
  { id: 'yurtici', name: 'Yurtiçi Kargo', logo: '🟡', fee: 49, eta: '1-2 iş günü', isActive: true },
  { id: 'mng', name: 'MNG Kargo', logo: '🔵', fee: 45, eta: '1-2 iş günü', isActive: true },
  { id: 'aras', name: 'Aras Kargo', logo: '🟠', fee: 44, eta: '1-3 iş günü', isActive: true },
  { id: 'ptt', name: 'PTT Kargo', logo: '⚫', fee: 39, eta: '2-4 iş günü', isActive: true },
  { id: 'surat', name: 'Sürat Kargo', logo: '🔴', fee: 47, eta: '1-2 iş günü', isActive: true },
];

export class CargoService {
  /**
   * Get all active cargo settings from MySQL / fallback
   */
  static async getCargoCarriers(): Promise<{ carriers: CargoCarrier[]; freeShippingThreshold: number }> {
    try {
      if (process.env.DATABASE_URL) {
        const dbCargo = await prisma.cargoSetting.findMany({
          orderBy: { createdAt: 'asc' },
        });

        if (dbCargo && dbCargo.length > 0) {
          const threshold = dbCargo[0].freeShippingThreshold || 1000;
          const carriers: CargoCarrier[] = dbCargo.map((c) => ({
            id: c.code,
            name: c.name,
            logo: c.logo,
            logoImage: c.logoImage || undefined,
            fee: c.fee,
            eta: c.eta,
            isActive: c.isActive,
          }));
          return { carriers, freeShippingThreshold: threshold };
        }
      }
    } catch (e) {
      console.warn('Prisma get cargo carriers error', e);
    }

    return { carriers: DEFAULT_CARGO_CARRIERS, freeShippingThreshold: 1000 };
  }

  /**
   * Calculate exact shipping fee on server
   */
  static calculateShippingFee(cartTotal: number, carrierFee: number, threshold = 1000): number {
    if (cartTotal >= threshold) return 0;
    return carrierFee;
  }
}
