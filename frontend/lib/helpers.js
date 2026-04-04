/**
 * Format address object to readable string
 * @param {Object|string} address - Address object with street, city, state, pincode OR string
 * @returns {string} Formatted address string
 */
export function formatAddress(address) {
  if (!address) return "Address Not Available";
  
  // If already a string, return it
  if (typeof address === 'string') return address;
  
  // If it's an object, format it
  const parts = [
    address.street,
    address.city,
    address.state,
    address.pincode
  ].filter(Boolean); // Remove empty values
  
  return parts.length > 0 ? parts.join(', ') : "Address Not Available";
}