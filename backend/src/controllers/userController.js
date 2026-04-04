const User = require('../models/User');

async function getProfile(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: 'Profile retrieved successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    const {
      firstName,
      lastName,
      organizationName,
      gstNumber,
      address,
      notificationPreferences,
      profileImage,
    } = req.body;

    // Build update object - only allow certain fields to be updated
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName.trim();
    if (lastName !== undefined) updateData.lastName = lastName.trim();
    if (organizationName !== undefined) updateData.organizationName = organizationName.trim();
    if (gstNumber !== undefined) updateData.gstNumber = gstNumber.trim();
    if (address) updateData.address = address;
    if (notificationPreferences) updateData.notificationPreferences = notificationPreferences;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
