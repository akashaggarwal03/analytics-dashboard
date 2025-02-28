import React, { createContext, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { WebSocketMessage } from '../types/shared.types';

// Define the context type
interface WebSocketContextType {
  lastMessage: WebSocketMessage | null;
}

// Create context with undefined as default (requires useContext check)
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// WebSocket URL (could move to config later)
const WS_URL = 'ws://127.0.0.1:8000/dashboard/ws';

// Props type for the provider
interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connected'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: () => true, // Auto-reconnect on disconnect
  });

  // Cast lastJsonMessage to WebSocketMessage or null
  const lastMessage = lastJsonMessage as WebSocketMessage | null;

  // Provide the context value
  return (
    <WebSocketContext.Provider value={{ lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for consuming the context with type safety
export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};