import { Product } from '@/lib/types/ecommerce';

export interface RecommendationOptions {
  limit?: number;
  excludeProductId?: string;
  strategy?: 'category' | 'collection' | 'price' | 'color' | 'hybrid';
}

export function getProductRecommendations(
  targetProduct: Product,
  allProducts: Product[],
  options: RecommendationOptions = {}
): Product[] {
  const limit = options.limit || 4;
  const excludeId = options.excludeProductId || targetProduct.id;

  const candidates = allProducts.filter((p) => p.id !== excludeId);

  // Score candidate products based on attributes
  const scored = candidates.map((p) => {
    let score = 0;

    // 1. Same Category match (+4 points)
    if (p.category === targetProduct.category) score += 4;

    // 2. Same Collection match (+3 points)
    if (targetProduct.collection && p.collection === targetProduct.collection) score += 3;

    // 3. Same Fabric type (+3 points)
    if (p.fabric === targetProduct.fabric) score += 3;

    // 4. Style Category match (+2 points)
    if (p.styleCategory === targetProduct.styleCategory) score += 2;

    // 5. Similar Price Range (+/- 25% price range, +2 points)
    const priceDiff = Math.abs(p.price - targetProduct.price) / targetProduct.price;
    if (priceDiff <= 0.25) score += 2;

    // 6. Color overlap (+1 point)
    const targetColorNames = new Set(targetProduct.colors.map((c) => c.name.toLowerCase()));
    const hasColorOverlap = p.colors.some((c) => targetColorNames.has(c.name.toLowerCase()));
    if (hasColorOverlap) score += 1;

    return { product: p, score };
  });

  // Sort by score descending and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.product);
}
