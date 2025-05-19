import { API_BASE_URL } from '@/constants/ApiConfig';

export async function fetchNotifications(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/notification/notifications`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return response.json();
}

export async function markNotificationAsRead(token: string, notificationId: string) {
  const response = await fetch(`${API_BASE_URL}/api/notification/notifications/${notificationId}/mark-as-read/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
  return response.json();
}
