import { apiClient } from './api';
import { API_CONFIG } from '@/constants/api';
import { io, Socket } from 'socket.io-client';

export type PresenceEntry = {
  userId: string;
  status: 'online' | 'offline' | string;
  lastSeen?: number | null;
  deviceCount?: number;
};

export class PresenceService {
  private static socket: Socket | null = null;
  private static heartbeatInterval: any = null;

  static async fetchList(limit = 100) {
    // presence-service default port 4001
    const url = `${process.env.EXPO_PUBLIC_PRESENCE_URL || 'http://localhost:4001'}/presence/list?limit=${limit}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return { success: false, data: [] as PresenceEntry[] };
      const body = await res.json();
      return { success: true, data: body.data as PresenceEntry[] };
    } catch (err) {
      return { success: false, data: [] as PresenceEntry[] };
    }
  }

  static connect(token?: string, onUpdate?: (evt: any) => void) {
    if (this.socket) return this.socket;

    const url = process.env.EXPO_PUBLIC_PRESENCE_URL || 'http://localhost:4001';
    const socket = io(url, {
      auth: { token },
      transports: ['websocket'],
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      // start heartbeat every 25s
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = setInterval(() => {
        socket.emit('heartbeat');
      }, 25000);
    });

    socket.on('presence:update', (evt: any) => {
      onUpdate?.(evt);
    });

    socket.on('presence:event', (evt: any) => {
      onUpdate?.(evt);
    });

    socket.on('disconnect', () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    });

    this.socket = socket;
    return socket;
  }

  static disconnect() {
    if (this.socket) {
      try { this.socket.disconnect(); } catch (e) {}
      this.socket = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
