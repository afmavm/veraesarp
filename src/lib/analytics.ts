type AnalyticsEvent =
  | 'product_view'
  | 'category_view'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'begin_checkout'
  | 'purchase'
  | 'coupon_apply'
  | 'newsletter_signup';

interface AnalyticsPayload {
  eventName: AnalyticsEvent;
  params?: Record<string, any>;
}

/**
 * Centralized E-Commerce Analytics Event Tracker
 * Safe for client & server, dispatches to Google Analytics (gtag), Meta Pixel, or custom logger.
 */
export function trackEvent(eventName: AnalyticsEvent, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // 1. Google Analytics (gtag) integration if available
  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // 2. Custom DataLayer / Logger event dispatch
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push(eventData);
  }

  // 3. Dev log
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS EVENT] ${eventName}`, params);
  }
}
