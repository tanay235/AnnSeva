const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const Inventory = require('../models/Inventory');

dotenv.config();

const ARYAN_ID = '69d0f3a28f3bfdd32fbfe93a';
const TANAY_ID = '69d0f6618f3bfdd32fbfe950';

const reseed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Cleaning up Requests and Notifications...');
    await Request.deleteMany({});
    await Notification.deleteMany({});

    // Reset all Inventory to active first
    await Inventory.updateMany({ sellerId: TANAY_ID }, { status: 'active' });

    const requests = [
      {
        buyerId: ARYAN_ID,
        sellerId: TANAY_ID,
        inventoryId: '69d11cc43cc6f14e924081ea', // Cookies
        quantityRequested: 5,
        unit: 'Units',
        expectedPriceTotal: 1000,
        status: 'Pending',
        note: 'Interested in these cookies for our office.'
      },
      {
        buyerId: ARYAN_ID,
        sellerId: TANAY_ID,
        inventoryId: '69d11cc43cc6f14e924081eb', // Coffee
        quantityRequested: 2,
        unit: 'Units',
        expectedPriceTotal: 700,
        status: 'Accepted',
        note: 'Need these urgently for the team.'
      },
      {
        buyerId: ARYAN_ID,
        sellerId: TANAY_ID,
        inventoryId: '69d11cc43cc6f14e914081ec', // Atta (Wait, let's use the one from the search output)
        inventoryId: '69d11cc43cc6f14e924081ec',
        quantityRequested: 1,
        unit: 'Units',
        expectedPriceTotal: 320,
        status: 'Sold',
        note: 'Payment completed. Ready for pickup.'
      }
    ];

    await Request.insertMany(requests);
    console.log('Inserted 3 requests (Pending, Accepted, Sold).');

    // Sync Inventory Statuses
    await Inventory.findByIdAndUpdate('69d11cc43cc6f14e924081eb', { status: 'reserved' }); // Coffee -> Accepted/Reserved
    await Inventory.findByIdAndUpdate('69d11cc43cc6f14e924081ec', { status: 'sold' });     // Atta -> Sold

    console.log('Syncing Inventory statuses: Coffee (Reserved), Atta (Sold)');
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error reseeding:', error);
    process.exit(1);
  }
};

reseed();
