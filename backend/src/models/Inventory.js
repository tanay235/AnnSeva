const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inventory must belong to a seller (User)'],
    },
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Snacks & Confectionery',
        'Beverages',
        'Staples & Grains',
        'Packaged Meals',
        'Dairy & Perishables',
        'FMCG Non-Food',
        'Other'
      ],
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Quantity available is required'],
      min: 1,
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      enum: ['Cartons', 'Pallets', 'Units', 'Kg', 'Liters'],
    },
    mrpPerUnit: {
      type: Number,
      required: [true, 'MRP per unit is required'],
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    aiSuggestedPrice: {
      type: Number,
      description: 'The optimal liquidation price suggested by the internal AI model.',
    },
    listingPrice: {
      type: Number,
      required: [true, 'Listing price is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'sold_out', 'expired', 'recalled'],
      default: 'active',
    },
    productImages: [
      {
        type: String,
        description: 'URLs to product images hosted on a storage bucket',
      }
    ],
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
inventorySchema.index({ sellerId: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
