/**
 * WebSocket Service for Real-time Communication
 * 
 * Provides real-time updates for:
 * - Inventory changes
 * - New orders
 * - Low stock alerts
 * - System notifications
 */

type WebSocketMessage = {
  type: string;
  data?: any;
  message?: string;
  timestamp?: string;
};

type MessageHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private isConnecting = false;

  /**
   * Connect to WebSocket server
   */
  connect(token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    const wsUrl = this.getWebSocketUrl(token);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.attemptReconnect(token);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  /**
   * Subscribe to specific message type
   */
  on(messageType: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)?.push(handler);
  }

  /**
   * Unsubscribe from message type
   */
  off(messageType: string, handler: MessageHandler): void {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Send message to server
   */
  send(type: string, data?: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  /**
   * Subscribe to channel
   */
  subscribe(channel: string): void {
    this.send('subscribe', { channel });
  }

  /**
   * Send ping to keep connection alive
   */
  ping(): void {
    this.send('ping');
  }

  /**
   * Get WebSocket connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming message
   */
  private handleMessage(message: WebSocketMessage): void {
    console.log('📨 WebSocket message:', message.type);

    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.data || message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    }

    // Handle special message types
    switch (message.type) {
      case 'connection':
        console.log('Connected to WebSocket:', message.message);
        break;
      case 'pong':
        console.log('Received pong from server');
        break;
      default:
        // Custom message types handled by subscribers
        break;
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect(token);
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Get WebSocket URL
   */
  private getWebSocketUrl(token: string): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_URL || 'localhost:5000';
    return `${protocol}//${host}/ws?token=${token}`;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();

// Export types
export type { WebSocketMessage, MessageHandler };
