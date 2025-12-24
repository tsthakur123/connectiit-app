import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendDM: (receiverId: string, content: string) => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:3000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthStore();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const socketRef = useRef<Socket | null>(null); // Track socket instance with ref
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000; // 3 seconds

  // Connect when user is available - ONLY depend on user?.id
  useEffect(() => {
    if (!user?.id) {
      // Disconnect if no user
      if (socketRef.current) {
        console.log('Disconnecting socket - no user');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    // Check if socket already exists and is connected
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log('Connecting to socket server:', CHAT_SERVICE_URL);
    const newSocket = io(CHAT_SERVICE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;

      // Register user with socket server
      if (user?.id) {
        newSocket.emit('register', user.id);
        console.log('📝 Registered user:', user.id);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);

      // Don't manually reconnect - let Socket.IO handle it
      // Only reconnect if server forcefully disconnected
      if (reason === 'io server disconnect') {
        reconnectTimeoutRef.current = setTimeout(() => {
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS && user?.id) {
            reconnectAttemptsRef.current++;
            console.log(`🔄 Reconnection attempt ${reconnectAttemptsRef.current}`);
            // Trigger reconnection by clearing socket ref
            socketRef.current = null;
            setSocket(null);
          }
        }, RECONNECT_DELAY);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up socket');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user?.id

  const sendDM = useCallback(async (receiverId: string, content: string): Promise<void> => {
    if (!socketRef.current || !isConnected || !user?.id) {
      throw new Error('Socket not connected or user not authenticated');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Message send timeout'));
      }, 10000); // 10 second timeout

      socketRef.current!.emit('send-dm', {
        userId: user.id,
        receiverId,
        content,
      }, (response: { success?: boolean; error?: string }) => {
        clearTimeout(timeout);
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve();
        }
      });

      // Fallback: resolve after emit (Socket.IO doesn't always have callbacks)
      setTimeout(() => {
        clearTimeout(timeout);
        resolve();
      }, 100);
    });
  }, [isConnected, user?.id]); // Use socketRef instead of socket state

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendDM }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

