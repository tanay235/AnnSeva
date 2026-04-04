import { request } from '../lib/api';

/**
 * Get all active inventory deals near the user's location
 */
export async function getNearbyDeals() {
  return await request('/api/food/nearby/deals');
}

/**
 * Get all product listings owned by the current seller
 */
export async function getMyListings() {
  return await request('/api/food/my/listings');
}

/**
 * Create a new inventory listing (seller only)
 */
export async function createInventoryListing(data) {
  return await request('/api/food', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get specific inventory details
 */
export async function getInventoryById(id) {
  return await request(`/api/food/${id}`);
}

/**
 * Delete an inventory listing (seller only)
 */
export async function deleteInventoryListing(id) {
  return await request(`/api/food/${id}`, {
    method: 'DELETE'
  });
}
