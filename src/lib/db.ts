import fs from 'fs';
import path from 'path';
import {
  Product,
  CustomerOrder,
  CariAccount,
  CariTransaction,
  CampaignRule,
  Coupon,
  SiteSettings,
} from '@/lib/types/ecommerce';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CARI_ACCOUNTS,
  MOCK_CARI_TRANSACTIONS,
  MOCK_CAMPAIGNS,
  MOCK_COUPONS,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/data/mock-data';

export interface DatabaseSchema {
  siteSettings: SiteSettings;
  products: Product[];
  orders: CustomerOrder[];
  cariAccounts: CariAccount[];
  cariTransactions: CariTransaction[];
  campaigns: CampaignRule[];
  coupons: Coupon[];
  registeredUsers?: any[];
  updatedAt: string;
}

const DB_FILE_PATH = path.join(process.cwd(), 'prisma', 'veraesarp_db.json');

// Ensure db file exists with initial data
export function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialData: DatabaseSchema = {
        siteSettings: DEFAULT_SITE_SETTINGS,
        products: MOCK_PRODUCTS,
        orders: MOCK_ORDERS,
        cariAccounts: MOCK_CARI_ACCOUNTS,
        cariTransactions: MOCK_CARI_TRANSACTIONS,
        campaigns: MOCK_CAMPAIGNS,
        coupons: MOCK_COUPONS,
        updatedAt: new Date().toISOString(),
      };
      saveDatabase(initialData);
      return initialData;
    }

    const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent) as DatabaseSchema;
  } catch (error) {
    console.error('Failed to read database file', error);
    return {
      siteSettings: DEFAULT_SITE_SETTINGS,
      products: MOCK_PRODUCTS,
      orders: MOCK_ORDERS,
      cariAccounts: MOCK_CARI_ACCOUNTS,
      cariTransactions: MOCK_CARI_TRANSACTIONS,
      campaigns: MOCK_CAMPAIGNS,
      coupons: MOCK_COUPONS,
      updatedAt: new Date().toISOString(),
    };
  }
}

export function saveDatabase(data: Partial<DatabaseSchema>): DatabaseSchema {
  try {
    const current = fs.existsSync(DB_FILE_PATH)
      ? JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'))
      : {
          siteSettings: DEFAULT_SITE_SETTINGS,
          products: MOCK_PRODUCTS,
          orders: MOCK_ORDERS,
          cariAccounts: MOCK_CARI_ACCOUNTS,
          cariTransactions: MOCK_CARI_TRANSACTIONS,
          campaigns: MOCK_CAMPAIGNS,
          coupons: MOCK_COUPONS,
        };

    const updatedData: DatabaseSchema = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(updatedData, null, 2), 'utf-8');
    return updatedData;
  } catch (error) {
    console.error('Failed to write database file', error);
    throw error;
  }
}
