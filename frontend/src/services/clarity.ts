/**
 * Microsoft Clarity Analytics Service
 * 
 * Provides methods to track user interactions and custom events
 * Documentation: https://docs.microsoft.com/en-us/clarity/
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

class ClarityService {
  private isEnabled: boolean = false;

  constructor() {
    // Check if Clarity is loaded
    if (typeof window !== 'undefined' && window.clarity) {
      this.isEnabled = true;
      console.log('✅ Microsoft Clarity Analytics initialized');
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, metadata?: Record<string, any>): void {
    if (!this.isEnabled || !window.clarity) return;

    try {
      window.clarity('event', eventName);
      if (metadata) {
        console.log(`📊 Clarity Event: ${eventName}`, metadata);
      }
    } catch (error) {
      console.error('Clarity tracking error:', error);
    }
  }

  /**
   * Set custom user ID
   */
  setUserId(userId: string): void {
    if (!this.isEnabled || !window.clarity) return;

    try {
      window.clarity('identify', userId);
      console.log(`👤 Clarity User ID set: ${userId}`);
    } catch (error) {
      console.error('Clarity user ID error:', error);
    }
  }

  /**
   * Set custom session tag
   */
  setTag(key: string, value: string): void {
    if (!this.isEnabled || !window.clarity) return;

    try {
      window.clarity('set', key, value);
    } catch (error) {
      console.error('Clarity tag error:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string): void {
    this.trackEvent('page_view', { page: pageName });
  }

  /**
   * Track user action
   */
  trackAction(action: string, details?: Record<string, any>): void {
    this.trackEvent(`action_${action}`, details);
  }

  /**
   * Track product interaction
   */
  trackProductInteraction(action: 'view' | 'create' | 'update' | 'delete', productId?: string): void {
    this.trackEvent(`product_${action}`, { productId });
  }

  /**
   * Track order interaction
   */
  trackOrderInteraction(action: 'create' | 'update' | 'view', orderId?: string): void {
    this.trackEvent(`order_${action}`, { orderId });
  }

  /**
   * Track authentication events
   */
  trackAuth(action: 'login' | 'logout' | 'signup', userId?: string): void {
    this.trackEvent(`auth_${action}`, { userId });
  }

  /**
   * Track errors
   */
  trackError(errorType: string, errorMessage: string): void {
    this.trackEvent('error', { type: errorType, message: errorMessage });
  }

  /**
   * Track WebSocket events
   */
  trackWebSocket(action: 'connect' | 'disconnect' | 'message', details?: Record<string, any>): void {
    this.trackEvent(`websocket_${action}`, details);
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('search', { query, resultsCount });
  }

  /**
   * Track export/download
   */
  trackExport(type: 'pdf' | 'excel' | 'csv', dataType: string): void {
    this.trackEvent('export', { type, dataType });
  }
}

// Export singleton instance
export const clarityService = new ClarityService();

export default clarityService;