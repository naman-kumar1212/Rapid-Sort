/**
 * React Hook for WebSocket Integration
 * 
 * Usage:
 * const { isConnected, subscribe, send } = useWebSocket();
 * 
 * useEffect(() => {
 *   subscribe('inventory_update', (data) => {
 *     console.log('Inventory updated:', data);
 *   });
 * }, [subscribe]);
 */

import { useEffect, useCallback, useState } from 'react';
import { websocketService, MessageHandler } from '../services/websocket';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Connect to WebSocket
      websocketService.connect(token);

      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(websocketService.isConnected());
      }, 1000);

      // Ping server every 30 seconds to keep connection alive
      const pingInterval = setInterval(() => {
        if (websocketService.isConnected()) {
          websocketService.ping();
        }
      }, 30000);

      return () => {
        clearInterval(interval);
        clearInterval(pingInterval);
        websocketService.disconnect();
      };
    }
  }, []);

  const subscribe = useCallback((messageType: string, handler: MessageHandler) => {
    websocketService.on(messageType, handler);
    return () => websocketService.off(messageType, handler);
  }, []);

  const send = useCallback((type: string, data?: any) => {
    websocketService.send(type, data);
  }, []);

  const subscribeToChannel = useCallback((channel: string) => {
    websocketService.subscribe(channel);
  }, []);

  return {
    isConnected,
    subscribe,
    send,
    subscribeToChannel
  };
};
