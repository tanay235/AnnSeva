/**
 * Valid food categories mapping
 * Maps user-friendly names to database enum values
 */

const VALID_CATEGORIES = {
  'Snacks & Confectionery': 'Snacks & Confectionery',
  'Snacks': 'Snacks & Confectionery',
  'Candy': 'Snacks & Confectionery',
  'Biscuits': 'Snacks & Confectionery',
  'Chips': 'Snacks & Confectionery',
  'Chocolates': 'Snacks & Confectionery',
  
  'Beverages': 'Beverages',
  'Drinks': 'Beverages',
  'Juice': 'Beverages',
  'Water': 'Beverages',
  'Coffee': 'Beverages',
  'Tea': 'Beverages',
  
  'Staples & Grains': 'Staples & Grains',
  'Staples': 'Staples & Grains',
  'Grains': 'Staples & Grains',
  'Rice': 'Staples & Grains',
  'Flour': 'Staples & Grains',
  'Pulses': 'Staples & Grains',
  'Cereals': 'Staples & Grains',
  
  'Packaged Meals': 'Packaged Meals',
  'Meals': 'Packaged Meals',
  'Noodles': 'Packaged Meals',
  'Ready to Eat': 'Packaged Meals',
  
  'Dairy & Perishables': 'Dairy & Perishables',
  'Dairy': 'Dairy & Perishables',
  'Milk': 'Dairy & Perishables',
  'Cheese': 'Dairy & Perishables',
  'Yogurt': 'Dairy & Perishables',
  'Perishables': 'Dairy & Perishables',
  
  'FMCG Non-Food': 'FMCG Non-Food',
  'Non-Food': 'FMCG Non-Food',
  'Personal Care': 'FMCG Non-Food',
  'Detergent': 'FMCG Non-Food',
  
  'Other': 'Other'
};

/**
 * Normalize category name to database enum value
 * @param {string} category - User input category
 * @returns {string} - Valid database category or 'Other'
 */
function normalizeCategoryName(category) {
  if (!category || typeof category !== 'string') {
    return 'Other';
  }

  // Trim and normalize the input
  const normalized = category.trim();
  
  // Try exact match first (case-insensitive)
  for (const [key, value] of Object.entries(VALID_CATEGORIES)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return value;
    }
  }

  // If no match, return 'Other'
  return 'Other';
}

/**
 * Get all valid category options for the frontend
 * @returns {array} - Array of valid category strings
 */
function getValidCategories() {
  return [
    'Snacks & Confectionery',
    'Beverages',
    'Staples & Grains',
    'Packaged Meals',
    'Dairy & Perishables',
    'FMCG Non-Food',
    'Other'
  ];
}

module.exports = {
  VALID_CATEGORIES,
  normalizeCategoryName,
  getValidCategories
};
