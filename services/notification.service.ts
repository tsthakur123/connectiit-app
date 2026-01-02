import { apiClient } from './api';

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
  } catch (err) {
    return {};
  }
};

const API_ENDPOINTS = {
  BASE: 'http://localhost:3010',
  NOTIFICATIONS: {
    BASE: 'http://localhost:3010/notifications',
    STREAM: 'http://localhost:3010/notifications/stream',
    MARK_READ: (id: string) => `http://localhost:3010/notifications/${id}/read`,
    MARK_ALL_READ: 'http://localhost:3010/notifications/read_all'
  }
};

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: string;
  entity_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export class NotificationService {
  static async fetchNotifications(token: string | null, all = false) {
    const qs = all ? '?all=true' : '';
    const headers: Record<string, string> = {};
    const userId = token ? parseJwt(token).user_id : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['X-User-ID']=`${userId}`
    }
    const response = await fetch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}${qs}`, {
      method: 'GET',
      headers,
    });
    const success = response.ok;
    const data = success ? await response.json() : undefined;
    return { success, data };
  }

  static async markRead(id: string, token: string | null) {
    const headers: Record<string, string> = {};
    const userId = token ? parseJwt(token).user_id : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
       headers['X-User-ID']=`${userId}`
    }
    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {
      method: 'POST',
      headers,
    });
    const success = response.ok;
    const data = success ? await response.json() : undefined;
    return { success, data };
  }

  static async markAllRead(token: string | null) {
    const userId = token ? parseJwt(token).user_id : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
       headers['X-User-ID']=`${userId}`
    }
    const response = await fetch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, {
      method: 'POST',
      headers,
    });
    const success = response.ok;
    const data = success ? await response.json() : undefined;
    return { success, data };
  }

  // SSE-friendly: try to use global EventSource else fallback to polling.
  static subscribe(userId: string, token: string | null, onMessage: (n: Notification) => void) {
    // Try EventSource (works in web). In RN, EventSource polyfill may not be available.
    try {
      // @ts-ignore
      if (typeof EventSource !== 'undefined') {
        // Build url with query
        const url = `${API_ENDPOINTS.NOTIFICATIONS.STREAM}?user_id=${encodeURIComponent(userId)}`;
        // @ts-ignore
        const es = new EventSource(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        es.onmessage = (ev: any) => {
          try {
            const data = JSON.parse(ev.data);
            onMessage(data);
          } catch (err) {
            // ignore
          }
        };
        es.onerror = () => {
          es.close();
        };
        return () => es.close();
      }
    } catch (err) {
      // ignore
    }

    // Fallback: polling every 8 seconds
    const interval = setInterval(async () => {
      const res = await NotificationService.fetchNotifications(token, false);
      if (res.success && res.data?.notifications?.length) {
        for (const n of res.data.notifications) {
          onMessage(n);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }
}
