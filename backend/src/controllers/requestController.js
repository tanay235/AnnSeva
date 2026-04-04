const Request = require('../models/Request');
const Inventory = require('../models/Inventory');
const { createNotification } = require('./notificationController');

/**
 * Get all requests sent by the current Buyer (Customer)
 */
async function getBuyerRequests(req, res, next) {
  try {
    // Explicitly use the string ID and ensure we populate all fields needed for the dashboard
    const requests = await Request.find({ buyerId: req.user.id })
      .populate({
        path: 'inventoryId',
        select: 'productName mrpPerUnit listingPrice productImages category unit'
      })
      .populate({
        path: 'sellerId',
        select: 'firstName lastName organizationName address phoneNumber'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get all requests received by the current Seller
 */
async function getSellerRequests(req, res, next) {
  try {
    const requests = await Request.find({ sellerId: req.user.id })
      .populate('inventoryId', 'productName mrpPerUnit listingPrice productImages status')
      .populate('buyerId', 'firstName lastName email phoneNumber address')
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    return next(error);
  }
}

/**
 * Create a new deal request (Buyer)
 */
async function createRequest(req, res, next) {
  try {
    const { inventoryId, quantityRequested, expectedPriceTotal, note, pickupDeliveryTime } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      const error = new Error('Inventory item not found');
      error.status = 404;
      throw error;
    }

    if (inventory.quantityAvailable < quantityRequested) {
      const error = new Error('Not enough quantity available');
      error.status = 400;
      throw error;
    }

    const request = await Request.create({
      buyerId: req.user.id,
      sellerId: inventory.sellerId,
      inventoryId,
      quantityRequested,
      expectedPriceTotal,
      note,
      pickupDeliveryTime,
      status: 'Pending'
    });

    // Notify Seller
    await createNotification({
      user: inventory.sellerId,
      title: 'New Purchase Request',
      message: `A buyer has requested ${quantityRequested} units of ${inventory.productName}.`,
      type: 'request',
      relatedId: request._id
    });

    return res.status(201).json(request);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get single request details for tracking
 */
async function getRequestById(req, res, next) {
  try {
    const request = await Request.findById(req.params.id)
      .populate('inventoryId', 'productName mrpPerUnit listingPrice productImages category description')
      .populate('sellerId', 'firstName lastName organizationName address phoneNumber')
      .populate('buyerId', 'firstName lastName organizationName address phoneNumber');

    if (!request) {
      const error = new Error('Request not found');
      error.status = 404;
      throw error;
    }

    return res.status(200).json(request);
  } catch (error) {
    return next(error);
  }
}

/**
 * Cancel request (Buyer only)
 */
async function cancelRequest(req, res, next) {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      const error = new Error('Request not found');
      error.status = 404;
      throw error;
    }

    if (request.buyerId.toString() !== req.user.id) {
      const error = new Error('Not authorized to cancel this request');
      error.status = 403;
      throw error;
    }

    if (request.status !== 'Pending') {
      const error = new Error('Only pending requests can be cancelled');
      error.status = 400;
      throw error;
    }

    request.status = 'Cancelled';
    await request.save();

    return res.status(200).json(request);
  } catch (error) {
    return next(error);
  }
}

/**
 * Update request status (Accepted/Rejected/Sold) - Seller Action
 */
async function updateRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      const error = new Error('Request not found');
      error.status = 404;
      throw error;
    }

    // Notify Buyer of status change
    await createNotification({
      user: request.buyerId,
      title: `Order ${status}`,
      message: `The seller has marked your order as ${status}.`,
      type: 'status_change',
      relatedId: request._id
    });

    // Synchronize Inventory status if needed
    if (['Accepted', 'Sold', 'Rejected', 'Cancelled'].includes(status)) {
      const inventoryStatusMap = {
        'Accepted': 'reserved',
        'Sold': 'sold',
        'Rejected': 'active',
        'Cancelled': 'active'
      };
      
      const newInventoryStatus = inventoryStatusMap[status];
      if (newInventoryStatus) {
        await Inventory.findByIdAndUpdate(request.inventoryId, { status: newInventoryStatus });
        console.log(`[InventorySync] Listing ${request.inventoryId} status updated to: ${newInventoryStatus}`);
      }
    }

    return res.status(200).json(request);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBuyerRequests,
  getSellerRequests,
  updateRequestStatus,
  createRequest,
  getRequestById,
  cancelRequest
};
