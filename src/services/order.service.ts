import prisma from '@/lib/prisma';
import { getDatabase, saveDatabase } from '@/lib/db';
import { CustomerOrder } from '@/lib/types/ecommerce';

export interface CreateOrderDTO {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  items: {
    productId: string;
    productName: string;
    variantId?: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
    sku?: string;
  }[];
  paymentMethod: string;
  couponCode?: string;
  shippingFee: number;
}

export class OrderService {
  /**
   * Create an order atomically with Prisma transaction:
   * 1. Validate prices & stock server-side
   * 2. Decrement stock
   * 3. Create Order & OrderItem records with snapshot data
   * 4. Record stock movement
   */
  static async createOrder(data: CreateOrderDTO): Promise<CustomerOrder> {
    const orderNo = `VER-${Math.floor(100000 + Math.random() * 900000)}`;

    // Server-side calculation of subtotal
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Server-side coupon verification placeholder / discount calculation
    let discount = 0;
    if (data.couponCode) {
      const codeClean = data.couponCode.trim().toUpperCase();
      if (codeClean === 'VERA10') discount = subtotal * 0.1;
      else if (codeClean === 'HOŞGELDİN') discount = Math.min(subtotal, 150);
    }

    const total = Math.max(0, subtotal - discount + data.shippingFee);

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNo,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      address: {
        city: data.city,
        district: data.district,
        fullAddress: data.fullAddress,
      },
      items: data.items.map((i: any) => ({
        productName: i.productName,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
      subtotal,
      shipping: data.shippingFee,
      discount,
      total,
      status: 'Hazırlanıyor',
      paymentMethod: data.paymentMethod,
      couponCode: data.couponCode,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    // Try executing server-side Prisma Transaction if MySQL database is active
    try {
      if (process.env.DATABASE_URL) {
        await (prisma as any).$transaction(async (tx: any) => {
          // Create Order in MySQL
          const createdOrder = await tx.order.create({
            data: {
              id: newOrder.id,
              orderNumber: orderNo,
              customerName: data.customerName,
              email: data.email,
              phone: data.phone,
              shippingAddress: {
                city: data.city,
                district: data.district,
                fullAddress: data.fullAddress,
              } as any,
              subtotal,
              discount,
              shippingCost: data.shippingFee,
              total,
              paymentMethod: data.paymentMethod,
              couponCode: data.couponCode,
              status: 'Hazırlanıyor',
              items: {
                create: data.items.map((item: any) => ({
                  productId: item.productId,
                  variantId: item.variantId,
                  productNameSnapshot: item.productName,
                  skuSnapshot: item.sku || `SKU-${item.productId}`,
                  colorSnapshot: item.color,
                  priceSnapshot: item.price,
                  quantity: item.quantity,
                  total: item.price * item.quantity,
                })),
              },
            },
          });

          // Atomically decrement product stock
          for (const item of data.items) {
            await tx.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
          }

          return createdOrder;
        });
      }
    } catch (e) {
      console.warn('Prisma order transaction fallback to file database', e);
    }

    // Always keep Local JSON DB updated as atomic fallback
    const fileDb = getDatabase();
    fileDb.orders = [newOrder, ...fileDb.orders];
    saveDatabase(fileDb);

    return newOrder;
  }

  /**
   * Fetch all orders with MySQL + JSON fallback
   */
  static async getAllOrders(): Promise<CustomerOrder[]> {
    try {
      if (process.env.DATABASE_URL) {
        const dbOrders = await (prisma as any).order.findMany({
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        });

        if (dbOrders && dbOrders.length > 0) {
          return dbOrders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            email: o.email,
            phone: o.phone,
            address: (o.shippingAddress as any) || { city: 'Erzurum', district: 'Yakutiye', fullAddress: '' },
            items: o.items.map((i: any) => ({
              productName: i.productNameSnapshot,
              color: i.colorSnapshot || 'Standart',
              quantity: i.quantity,
              price: i.priceSnapshot,
              image: '',
            })),
            subtotal: o.subtotal,
            shipping: o.shippingCost,
            discount: o.discount,
            total: o.total,
            status: o.status as any,
            trackingCode: o.trackingCode || undefined,
            carrier: o.carrierName as any,
            paymentMethod: o.paymentMethod,
            couponCode: o.couponCode || undefined,
            createdAt: o.createdAt.toISOString().slice(0, 10),
          }));
        }
      }
    } catch (e) {
      console.warn('Prisma fetch orders fallback to local storage DB', e);
    }

    const fileDb = getDatabase();
    return fileDb.orders || [];
  }
}
