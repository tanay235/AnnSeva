import { request } from '../lib/api';

/**
 * Get current user profile
 */
export async function getProfile() {
  return await request('/api/user/profile');
}

/**
 * Update user profile
 */
export async function updateProfile(profileData) {
  return await request('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}
