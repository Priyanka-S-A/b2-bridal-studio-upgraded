const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Revenue = require('./models/Revenue');
const Bill = require('./models/Bill');

async function clean() {
  console.log("Connecting to DB:", process.env.MONGODB_URI);
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Find invalid revenues
  const invalidRevenues = await Revenue.find({
    $or: [
      { total: { $in: [0, null] } },
      { paymentMethod: { $exists: false } },
      { paymentMethod: null }
    ]
  });
  
  console.log(`\n--- INVALID REVENUES ---`);
  console.log(`Found ${invalidRevenues.length} invalid revenues.`);
  invalidRevenues.forEach(r => console.log(r));

  if (invalidRevenues.length > 0) {
    const revIds = invalidRevenues.map(r => r._id);
    await Revenue.deleteMany({ _id: { $in: revIds } });
    console.log(`Deleted ${invalidRevenues.length} invalid revenues.`);
  }

  // Find invalid bills
  const invalidBills = await Bill.find({
    $or: [
      { items: { $size: 0 } },
      { items: { $exists: false } }
    ]
  });
  
  console.log(`\n--- INVALID BILLS ---`);
  console.log(`Found ${invalidBills.length} invalid bills.`);
  invalidBills.forEach(b => console.log(b));

  if (invalidBills.length > 0) {
    const billIds = invalidBills.map(b => b._id);
    await Bill.deleteMany({ _id: { $in: billIds } });
    console.log(`Deleted ${invalidBills.length} invalid bills.`);
  }
  
  await mongoose.disconnect();
  console.log("Database cleanup finished.");
}

clean().catch(console.error);
