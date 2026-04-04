const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const User = require('./src/models/User');
const Inventory = require('./src/models/Inventory');
const Request = require('./src/models/Request');
const Notification = require('./src/models/Notification');

dotenv.config();

const ARYAN_ID = '69d0f3a28f3bfdd32fbfe93a';
const TANAY_ID = '69d0f6618f3bfdd32fbfe950';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // Clear existing operational data (Keeping Users)
    console.log('Cleaning up existing data...');
    await Inventory.deleteMany({});
    await Request.deleteMany({});
    await Notification.deleteMany({});

    console.log('Generating Inventory for Tanay Mittal (Mittal Brothers)...');
    
    const items = [
      {
        sellerId: TANAY_ID,
        productName: 'Amul Taaza Milk (1L)',
        category: 'Dairy & Perishables',
        quantityAvailable: 150,
        unit: 'Units',
        mrpPerUnit: 66,
        listingPrice: 45,
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        description: 'Fresh toned milk, surplus stock due to over-ordering. Perfect condition.',
        location: { type: 'Point', coordinates: [75.7873, 26.9124] },
        status: 'active'
      },
      {
        sellerId: TANAY_ID,
        productName: 'Maggi Masala Noodles (12-Pack)',
        category: 'Snacks & Confectionery',
        quantityAvailable: 40,
        unit: 'Cartons',
        mrpPerUnit: 168,
        listingPrice: 110,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
        description: 'Bulk cartons of Maggi 12-packs. Approaching 2-month expiry window.',
        location: { type: 'Point', coordinates: [75.7890, 26.9150] },
        status: 'active'
      },
      {
        sellerId: TANAY_ID,
        productName: 'Britannia Good Day Cookies (Case of 24)',
        category: 'Snacks & Confectionery',
        quantityAvailable: 25,
        unit: 'Units',
        mrpPerUnit: 480,
        listingPrice: 200,
        expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
        description: 'Cashew cookies bulk packs. Clearance sale for warehouse clearing.',
        location: { type: 'Point', coordinates: [75.7873, 26.9124] },
        status: 'active'
      },
      {
        sellerId: TANAY_ID,
        productName: 'Nescafe Classic Coffee (200g)',
        category: 'Beverages',
        quantityAvailable: 60,
        unit: 'Units',
        mrpPerUnit: 575,
        listingPrice: 350,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        description: 'Glass jars of Nescafe. Outer packaging slightly dusty, product sealed.',
        location: { type: 'Point', coordinates: [75.7900, 26.9100] },
        status: 'active'
      },
      {
        sellerId: TANAY_ID,
        productName: 'Aashirvaad Shudh Chakki Atta (10Kg)',
        category: 'Staples & Grains',
        quantityAvailable: 100,
        unit: 'Kg',
        mrpPerUnit: 450,
        listingPrice: 320,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        description: 'Fresh wheat flour bags. Great deal for restaurants or large families.',
        location: { type: 'Point', coordinates: [75.7873, 26.9124] },
        status: 'active'
      }
    ];

    const createdInventories = await Inventory.insertMany(items);
    console.log(`Inserted ${createdInventories.length} inventory items.`);

    console.log('Generating Requests for Aryan Garg...');
    
    const requests = [
      {
        buyerId: ARYAN_ID,
        sellerId: TANAY_ID,
        inventoryId: createdInventories[0]._id, // Milk
        quantityRequested: 10,
        unit: 'Units',
        expectedPriceTotal: 450,
        pickupDeliveryTime: '6:00 PM Tomorrow',
        note: 'Buying for local community kitchen. Can pick up from your warehouse.',
        status: 'Pending'
      },
      {
        buyerId: ARYAN_ID,
        sellerId: TANAY_ID,
        inventoryId: createdInventories[1]._id, // Maggi
        quantityRequested: 2,
        unit: 'Cartons',
        expectedPriceTotal: 220,
        pickupDeliveryTime: '11:00 AM Monday',
        note: 'Interested in bulk purchase if quality is good.',
        status: 'Accepted'
      }
    ];

    await Request.insertMany(requests);
    console.log('Inserted 2 requests.');

    console.log('Generating Notifications...');
    
    const notifications = [
      {
        userId: ARYAN_ID,
        type: 'new_listing',
        title: 'New Deal Nearby!',
        message: 'Mittal Brothers added Amul Taaza Milk at 32% discount near you.',
        relatedInventoryId: createdInventories[0]._id,
        actionUrl: `/listings/${createdInventories[0]._id}`
      },
      {
        userId: ARYAN_ID,
        type: 'order_update',
        title: 'Order Accepted!',
        message: 'Your request for Maggi Masala Noodles has been accepted by Tanay Mittal.',
        actionUrl: '/dashboard/buyer'
      },
      {
        userId: TANAY_ID,
        type: 'system_alert',
        title: 'New Request Received',
        message: 'Aryan Garg sent a request for 10 units of Amul Taaza Milk.',
        actionUrl: '/dashboard/seller'
      }
    ];

    await Notification.insertMany(notifications);
    console.log('Inserted 3 notifications.');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
