import { request } from '../lib/api';

/**
 * Get all requests sent by the current Buyer (Customer)
 */
export async function getMyRequests() {
  return await request('/api/requests/my-requests');
}

/**
 * Get all incoming requests for the current Seller's inventory
 */
export async function getIncomingRequests() {
  return await request('/api/requests/incoming');
}

/**
 * Create a new deal request for an inventory item
 */
export async function createRequest(requestData) {
  return await request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}

/**
 * Update request status (Accepted/Rejected/Sold)
 */
export async function updateRequestStatus(id, status) {
  return await request(`/api/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Get single request details for tracking
 */
export async function getRequestDetails(id) {
  return await request(`/api/requests/${id}`);
}

/**
 * Cancel request (Buyer only)
 */
export async function cancelRequest(id) {
  return await request(`/api/requests/${id}`, {
    method: 'DELETE'
  });
}
