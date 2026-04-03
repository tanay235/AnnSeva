const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password in queries by default
    },
    organizationName: {
      type: String,
      required: [true, 'Organization / Company Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['seller', 'buyer', 'admin'],
      required: [true, 'Role is required'],
    },
    warehouseLocation: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Add index on email for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
