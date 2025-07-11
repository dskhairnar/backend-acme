import mongoose from 'mongoose';
import { config } from '../config/env';
import { WeightEntry } from '../models/weightEntry.model';
import { User } from '../models/user.model';
import { addDays, format } from 'date-fns';

// Recent weight entries to add (continuing from the last entry in mockData)
const recentWeightEntries = [
  { weight: 161, date: '2024-07-15', notes: 'Feeling great, energy levels improved' },
  { weight: 160, date: '2024-07-29', notes: 'Consistent progress, clothes fitting better' },
  { weight: 159, date: '2024-08-12', notes: '25 pounds lost milestone!' },
  { weight: 158, date: '2024-08-26', notes: 'Maintaining healthy eating habits' },
  { weight: 157, date: '2024-09-09', notes: 'Feeling more confident and active' },
  { weight: 156, date: '2024-09-23', notes: 'Regular exercise routine established' },
  { weight: 155, date: '2024-10-07', notes: '30 pounds lost! Incredible progress' },
  { weight: 154, date: '2024-10-21', notes: 'Stable weight, good appetite control' },
  { weight: 153, date: '2024-11-04', notes: 'Continuing with medication as prescribed' },
  { weight: 152, date: '2024-11-18', notes: 'Feeling healthier and more energetic' },
  { weight: 151, date: '2024-12-02', notes: 'Holiday season, maintaining discipline' },
  { weight: 150, date: '2024-12-16', notes: '35 pounds lost! Amazing transformation' },
  { weight: 149, date: '2024-12-30', notes: 'End of year reflection - great progress' },
  { weight: 148, date: '2025-01-13', notes: 'New year, continuing the journey' },
  { weight: 147, date: '2025-01-27', notes: 'Consistent with medication and diet' },
  { weight: 146, date: '2025-02-10', notes: 'Feeling stronger and more confident' },
  { weight: 145, date: '2025-02-24', notes: '40 pounds lost! Life-changing results' },
  { weight: 144, date: '2025-03-10', notes: 'Spring approaching, feeling great' },
  { weight: 143, date: '2025-03-24', notes: 'Maintaining healthy lifestyle habits' },
  { weight: 142, date: '2025-04-07', notes: 'Consistent progress, no side effects' },
  { weight: 141, date: '2025-04-21', notes: 'Feeling more active and energetic' },
  { weight: 140, date: '2025-05-05', notes: '45 pounds lost! Incredible achievement' },
  { weight: 139, date: '2025-05-19', notes: 'Summer approaching, feeling confident' },
  { weight: 138, date: '2025-06-02', notes: 'Maintaining progress, healthy habits' },
  { weight: 137, date: '2025-06-16', notes: 'Feeling healthier than ever' },
  { weight: 136, date: '2025-06-30', notes: 'Halfway through the year, great progress' },
];

async function connectToDatabase() {
  try {
    await mongoose.connect(config.database.mongodbUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function addRecentWeightData() {
  try {
    console.log('📊 Adding recent weight entries...');
    
    // Find the demo user
    const user = await User.findOne({ email: 'patient@example.com' });
    if (!user) {
      console.error('❌ Demo user not found. Please run the seed script first.');
      process.exit(1);
    }
    
    let addedCount = 0;
    
    for (const entry of recentWeightEntries) {
      // Check if entry already exists for this date
      const existingEntry = await WeightEntry.findOne({
        userId: user._id,
        recordedAt: {
          $gte: new Date(entry.date),
          $lt: new Date(addDays(new Date(entry.date), 1))
        }
      });
      
      if (existingEntry) {
        console.log(`⚠️ Entry already exists for ${entry.date}, skipping...`);
        continue;
      }
      
      const weightEntry = new WeightEntry({
        userId: user._id,
        weight: entry.weight,
        recordedAt: new Date(entry.date),
        notes: entry.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      await weightEntry.save();
      addedCount++;
      console.log(`✅ Added weight entry: ${entry.weight} lbs on ${entry.date}`);
    }
    
    console.log(`\n🎉 Successfully added ${addedCount} new weight entries!`);
    
    // Get total weight entries for the user
    const totalEntries = await WeightEntry.countDocuments({ userId: user._id });
    console.log(`📊 Total weight entries for user: ${totalEntries}`);
    
    // Get latest entry
    const latestEntry = await WeightEntry.findOne({ userId: user._id })
      .sort({ recordedAt: -1 })
      .limit(1);
    
    if (latestEntry) {
      console.log(`📈 Latest weight: ${latestEntry.weight} lbs on ${format(latestEntry.recordedAt, 'MMM dd, yyyy')}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding recent weight data:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    await connectToDatabase();
    await addRecentWeightData();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script if this file is executed directly
if (require.main === module) {
  main();
}

export { main as addRecentWeightData }; 