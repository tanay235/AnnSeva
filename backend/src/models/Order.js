const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a buyer'],
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a seller'],
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Order must reference an inventory item'],
    },
    quantityOrdered: {
      type: Number,
      required: [true, 'Quantity ordered is required'],
      min: 1,
    },
    agreedPricePerUnit: {
      type: Number,
      required: [true, 'Agreed price per unit is required'],
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved_by_seller', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    notes: {
      type: String,
      maxlength: 500,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ inventoryId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
