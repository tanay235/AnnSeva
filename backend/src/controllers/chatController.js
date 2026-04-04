const Message = require('../models/Message');
const Request = require('../models/Request');

/**
 * @desc    Send a new message
 * @route   POST /api/chat/send
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { requestId, receiverId, text } = req.body;
    const senderId = req.user.id;

    // Check if the request exists and the sender/receiver are part of it
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (
      request.buyerId.toString() !== senderId &&
      request.sellerId.toString() !== senderId
    ) {
      return res.status(403).json({ success: false, error: 'You are not part of this request' });
    }

    const message = await Message.create({
      requestId,
      senderId,
      receiverId,
      text,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all messages for a specific request
 * @route   GET /api/chat/:requestId
 * @access  Private
 */
exports.getMessages = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Check if the request exists and the user is part of it
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    if (
      request.buyerId.toString() !== userId &&
      request.sellerId.toString() !== userId
    ) {
      return res.status(403).json({ success: false, error: 'You are not part of this request' });
    }

    const messages = await Message.find({ requestId })
      .populate('senderId', 'firstName lastName organizationName role')
      .sort({ createdAt: 1 });

    // Mark messages as read if the receiver is the current user
    await Message.updateMany(
      { requestId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
