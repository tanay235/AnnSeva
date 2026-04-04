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
        select: 'productName mrpPerUnit listingPrice productImage category unit'
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
      .populate('inventoryId', 'productName mrpPerUnit listingPrice productImage status')
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

    // Create the request
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

    // Decrease inventory quantity using atomic operation
    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      { $inc: { quantityAvailable: -quantityRequested } },
      { new: true }
    );
    
    // Mark as sold_out if all quantity is depleted
    if (updatedInventory.quantityAvailable === 0) {
      await Inventory.findByIdAndUpdate(
        inventoryId,
        { status: 'sold_out' }
      );
      console.log(`[InventoryUpdate] Listing ${inventoryId} marked as sold_out`);
    }
    
    console.log(`[InventoryUpdate] Quantity reduced by ${quantityRequested} for inventory ${inventoryId}`);

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
      .populate('inventoryId', 'productName mrpPerUnit listingPrice productImage category description')
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
    console.log(`[CancelRequest] Starting cancellation for request ${req.params.id} by user ${req.user.id}`);
    
    const request = await Request.findById(req.params.id);
    if (!request) {
      console.log(`[CancelRequest] Request not found: ${req.params.id}`);
      const error = new Error('Request not found');
      error.status = 404;
      throw error;
    }
    
    console.log(`[CancelRequest] Found request with status: ${request.status}, buyerId: ${request.buyerId}`);

    if (request.buyerId.toString() !== req.user.id) {
      console.log(`[CancelRequest] Authorization denied - buyer mismatch`);
      const error = new Error('Not authorized to cancel this request');
      error.status = 403;
      throw error;
    }

    if (request.status !== 'Pending') {
      console.log(`[CancelRequest] Cannot cancel - status is ${request.status}, not Pending`);
      const error = new Error('Only pending requests can be cancelled');
      error.status = 400;
      throw error;
    }

    // Restore inventory quantity when request is cancelled using atomic operation
    console.log(`[CancelRequest] Restoring ${request.quantityRequested} units for inventory ${request.inventoryId}`);
    await Inventory.findByIdAndUpdate(
      request.inventoryId,
      { $inc: { quantityAvailable: request.quantityRequested } }
    );
    
    // If was marked as sold_out, change back to active
    const inventory = await Inventory.findById(request.inventoryId);
    if (inventory && inventory.status === 'sold_out') {
      await Inventory.findByIdAndUpdate(
        request.inventoryId,
        { status: 'active' }
      );
      console.log(`[InventoryRestore] Status changed from sold_out to active for inventory ${request.inventoryId}`);
    }
    
    console.log(`[InventoryRestore] ${request.quantityRequested} units restored for inventory ${request.inventoryId}`);

    request.status = 'Cancelled';
    console.log(`[CancelRequest] Saving request with status Cancelled...`);
    const savedRequest = await request.save();
    console.log(`[CancelRequest] Request saved successfully, status: ${savedRequest.status}`);
    
    console.log(`[CancelRequest] Successfully cancelled request ${req.params.id}`);

    return res.status(200).json(savedRequest);
  } catch (error) {
    console.log(`[CancelRequest] Error occurred: ${error.message}`);
    console.log(`[CancelRequest] Error status: ${error.status}`);
    console.log(`[CancelRequest] Error stack:`, error.stack);
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

    // Synchronize Inventory status and handle quantity restoration
    const inventory = await Inventory.findById(request.inventoryId);
    if (inventory) {
      if (status === 'Rejected' || status === 'Cancelled') {
        // Restore inventory quantity if rejected or cancelled
        inventory.quantityAvailable += request.quantityRequested;
        if (inventory.status === 'sold_out') {
          inventory.status = 'active';
        }
        console.log(`[InventoryRestore] ${request.quantityRequested} units restored for inventory ${request.inventoryId} - Reason: ${status}`);
      } else if (status === 'Accepted' || status === 'Sold') {
        // Keep quantity reduced for accepted/sold orders
        inventory.status = status === 'Sold' ? 'sold_out' : 'reserved';
        if (inventory.quantityAvailable === 0) {
          inventory.status = 'sold_out';
        }
      }
      
      await inventory.save();
      console.log(`[InventorySync] Listing ${request.inventoryId} status updated to: ${inventory.status}`);
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
