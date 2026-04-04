/**
 * Valid food categories for frontend forms
 */

export const VALID_CATEGORIES = [
  'Snacks & Confectionery',
  'Beverages',
  'Staples & Grains',
  'Packaged Meals',
  'Dairy & Perishables',
  'FMCG Non-Food',
  'Other'
];

export const CATEGORY_SHORTCUTS = {
  'Snacks': 'Snacks & Confectionery',
  'Drinks': 'Beverages',
  'Juice': 'Beverages',
  'Grains': 'Staples & Grains',
  'Rice': 'Staples & Grains',
  'Noodles': 'Packaged Meals',
  'Meals': 'Packaged Meals',
  'Dairy': 'Dairy & Perishables',
  'Milk': 'Dairy & Perishables',
  'NonFood': 'FMCG Non-Food',
  'PersonalCare': 'FMCG Non-Food',
};

/**
 * Normalize category to valid enum value
 */
export function normalizeCategoryName(category) {
  if (!category || typeof category !== 'string') {
    return 'Other';
  }

  const trimmed = category.trim();

  // Check if it matches a valid category exactly (case-insensitive)
  const match = VALID_CATEGORIES.find(
    cat => cat.toLowerCase() === trimmed.toLowerCase()
  );

  if (match) {
    return match;
  }

  // Check shortcuts
  for (const [key, value] of Object.entries(CATEGORY_SHORTCUTS)) {
    if (key.toLowerCase() === trimmed.toLowerCase()) {
      return value;
    }
  }

  return 'Other';
}

/**
 * Get category label for display
 */
export function getCategoryLabel(category) {
  return normalizeCategoryName(category);
}
