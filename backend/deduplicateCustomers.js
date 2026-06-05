/**
 * deduplicateCustomers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE-TIME MIGRATION SCRIPT
 *
 * Purpose:
 *   Remove duplicate Customer documents that were created because the same
 *   email address was stored with different casing (e.g. "ABC@gmail.com" and
 *   "abc@gmail.com" were treated as different records by the case-sensitive
 *   MongoDB unique index).
 *
 * What it does:
 *   1. Groups all Customer documents by their lowercase email address.
 *   2. For any group with more than one document (duplicates):
 *        - Keeps the most recently updated record (highest updatedAt).
 *        - Normalizes the kept record's email to lowercase.
 *        - Deletes all other duplicate documents.
 *   3. Prints a full report of what was found and removed.
 *
 * ONLINE CUSTOMERS ONLY:
 *   This script only touches Customer documents (used by the online booking
 *   portal). It does NOT touch offline Bills or Bookings.
 *
 * Usage:
 *   From the project root:
 *     node backend/deduplicateCustomers.js
 *
 *   Or from the backend directory:
 *     node deduplicateCustomers.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌  ERROR: MONGO_URI is not defined in backend/.env');
  process.exit(1);
}

// ── Customer schema (inline to keep script self-contained) ─────────────────
const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String },
    phone: String,
    password: String,
    dob: Date,
    googleId: String,
    authProvider: String,
    otp: String,
    otpExpires: Date,
    isVerified: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLoginDate: Date,
    accountStatus: String,
  },
  { timestamps: true }
);

const Customer =
  mongoose.models.Customer || mongoose.model('Customer', customerSchema);

// ── Helpers ────────────────────────────────────────────────────────────────
const normalizeEmail = (email) => (email || '').trim().toLowerCase();

// ── Main migration ─────────────────────────────────────────────────────────
async function deduplicateOnlineCustomers() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  B2 BRIDAL STUDIO — Customer Deduplication Migration Script  ');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB\n');

  // Fetch all customer documents
  const customers = await Customer.find().lean();
  console.log(`📋  Total customer records found: ${customers.length}`);

  if (customers.length === 0) {
    console.log('\n✅  No records to process. Exiting.\n');
    await mongoose.disconnect();
    return;
  }

  // Group by lowercase email
  const emailGroups = {};
  const noEmailCustomers = [];

  customers.forEach((c) => {
    const key = normalizeEmail(c.email);
    if (!key) {
      noEmailCustomers.push(c);
      return;
    }
    if (!emailGroups[key]) emailGroups[key] = [];
    emailGroups[key].push(c);
  });

  const totalGroups = Object.keys(emailGroups).length;
  const duplicateGroups = Object.entries(emailGroups).filter(
    ([, group]) => group.length > 1
  );

  console.log(`📧  Unique email addresses (case-insensitive): ${totalGroups}`);
  console.log(`🔴  Duplicate groups (same email, multiple records): ${duplicateGroups.length}`);
  if (noEmailCustomers.length > 0) {
    console.log(`⚠️   Customers with no email (skipped): ${noEmailCustomers.length}`);
  }

  if (duplicateGroups.length === 0) {
    console.log('\n✅  No duplicate records found. Database is already clean.\n');
    await mongoose.disconnect();
    return;
  }

  console.log('\n─── Processing duplicate groups ────────────────────────────────\n');

  let totalRemoved = 0;
  let totalNormalized = 0;

  for (const [email, group] of duplicateGroups) {
    console.log(`📧  ${email}  (${group.length} records found)`);

    // Sort descending by updatedAt — most recently updated first
    group.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0)
    );

    const keepRecord = group[0];
    const deleteRecords = group.slice(1);

    const keepDate = keepRecord.updatedAt || keepRecord.createdAt;
    console.log(
      `    ✔  KEEP   _id=${keepRecord._id}  updatedAt=${keepDate}  phone=${keepRecord.phone || 'N/A'}`
    );

    // Normalize email to lowercase on the kept record
    if (keepRecord.email !== email) {
      await Customer.updateOne(
        { _id: keepRecord._id },
        { $set: { email } }
      );
      console.log(`       ↳ Normalized email: "${keepRecord.email}" → "${email}"`);
      totalNormalized++;
    }

    for (const record of deleteRecords) {
      const delDate = record.updatedAt || record.createdAt;
      console.log(
        `    ✗  REMOVE _id=${record._id}  updatedAt=${delDate}  phone=${record.phone || 'N/A'}`
      );
      await Customer.deleteOne({ _id: record._id });
      totalRemoved++;
    }

    console.log('');
  }

  // Also normalize emails on non-duplicate records that have mixed-case emails
  console.log('─── Normalizing remaining mixed-case emails ────────────────────\n');
  let normalizedSingle = 0;

  for (const [email, group] of Object.entries(emailGroups)) {
    if (group.length !== 1) continue; // duplicates already handled above
    const c = group[0];
    if (c.email && c.email !== email) {
      await Customer.updateOne(
        { _id: c._id },
        { $set: { email } }
      );
      console.log(`    Normalized: "${c.email}" → "${email}"  (_id=${c._id})`);
      normalizedSingle++;
    }
  }

  if (normalizedSingle === 0) {
    console.log('    (All remaining records already have lowercase emails)\n');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  MIGRATION COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Duplicate groups processed : ${duplicateGroups.length}`);
  console.log(`  Duplicate records removed  : ${totalRemoved}`);
  console.log(`  Email fields normalized    : ${totalNormalized + normalizedSingle}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  await mongoose.disconnect();
  console.log('✅  Disconnected from MongoDB.\n');
}

deduplicateOnlineCustomers().catch((err) => {
  console.error('\n❌  Migration failed:', err.message);
  mongoose.disconnect().finally(() => process.exit(1));
});
