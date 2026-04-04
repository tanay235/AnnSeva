import { request } from '../lib/api';

/**
 * Get all notifications for the current user
 */
export async function getNotifications() {
  return await request('/api/notifications');
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id) {
  return await request(`/api/notifications/${id}/read`, {
    method: 'PATCH'
  });
}
