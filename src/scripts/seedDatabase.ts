import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/env';
// Demo data import removed. Please provide real seed data here.
import { User as UserModel } from '../models/user.model';
import { WeightEntry as WeightEntryModel } from '../models/weightEntry.model';
import { Shipment } from '../models/shipment.model';
// Define minimal types for seeding
interface UserSeed {
  email: string;
  name: string;
  dob: Date;
  passwordHash: string;
  role: string;
}

// Import models (you'll need to create these if they don't exist)
// import { Medication } from '../models/medication.model';
// import { Shipment } from '../models/shipment.model';

interface SeedData {
  users: any[];
  weightEntries: any[];
  medications: any[];
  shipments: any[];
}

const seedData: SeedData = {
  users: [],
  weightEntries: [],
  medications: [],
  shipments: [],
};

// ====== REAL SEED DATA PLACEHOLDERS ======
// Fill these arrays with real data to seed your database
type MedicationSeed = { name: string; dosage: string; frequency: string; startDate: Date; endDate?: Date | null };
type ShipmentSeed = { userEmail: string; medicationName: string; status: string; orderDate: Date; shippedDate?: Date; expectedDeliveryDate: Date; trackingNumber: string; quantity: number; address: string };

const yearUserEmail = 'yearuser@example.com';
const yearUserStartWeight = 250;
const yearUserEntries = [];
const now = new Date();
for (let i = 0; i < 52; i++) {
  const entryDate = new Date(now);
  entryDate.setDate(now.getDate() - i * 7);
  yearUserEntries.push({
    userEmail: yearUserEmail,
    weight: yearUserStartWeight - i * 1.5, // lose 1.5 lbs per week
    recordedAt: entryDate,
    notes: i === 0 ? 'Most recent entry' : undefined,
    createdAt: entryDate,
    updatedAt: entryDate,
  });
}

const realWeightEntries: Array<{ userEmail: string; weight: number; recordedAt: Date; notes?: string; createdAt?: Date; updatedAt?: Date }> = [
  {
    userEmail: 'patient@example.com',
    weight: 185,
    recordedAt: new Date(),
    notes: 'Initial entry',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ...yearUserEntries,
];

const realMedications: MedicationSeed[] = [
  // Example:
  // {
  //   name: 'Medication A',
  //   dosage: '10mg',
  //   frequency: 'Once daily',
  //   startDate: new Date('2024-01-01'),
  //   endDate: null,
  // },
];

const realShipments: Array<{ userEmail: string; items: { name: string; quantity: number; price?: number }[]; status: 'pending' | 'shipped' | 'delivered' | 'cancelled'; trackingNumber?: string; shippedAt?: Date; deliveredAt?: Date }> = [
  {
    userEmail: 'patient@example.com',
    items: [
      { name: 'Medication A', quantity: 30, price: 10.0 },
    ],
    status: 'shipped',
    trackingNumber: 'TRACK123',
    shippedAt: new Date(),
    deliveredAt: undefined,
  },
];
// =========================================

async function connectToDatabase() {
  try {
    await mongoose.connect(config.database.mongodbUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    console.log('🧹 Clearing existing data...');
    
    // Clear all collections
    await UserModel.deleteMany({});
    await WeightEntryModel.deleteMany({});
    
    // Uncomment when you have these models
    // await Medication.deleteMany({});
    // await Shipment.deleteMany({});
    
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedUsers() {
  try {
    console.log('👥 Seeding users...');
    // Hash the password for the demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const realUsers: UserSeed[] = [
      {
        email: 'patient@example.com',
        name: 'Demo Patient',
        dob: new Date('1990-01-01'),
        passwordHash: hashedPassword,
        role: 'user',
      },
      {
        email: yearUserEmail,
        name: 'Yearly Progress',
        dob: new Date('1985-06-15'),
        passwordHash: hashedPassword,
        role: 'user',
      },
    ];
    for (const userData of realUsers) {
      const user = new UserModel(userData);
      await user.save();
      seedData.users.push(user);
    }
    console.log(`✅ Seeded ${seedData.users.length} users`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

async function seedWeightEntries() {
  try {
    console.log('⚖️ Seeding weight entries...');
    for (const entry of realWeightEntries) {
      // Find the corresponding user by email
      const user = seedData.users.find(u => u.email === entry.userEmail);
      if (!user) {
        console.warn('⚠️ User not found for weight entry:', entry);
        continue;
      }
      const entryData = {
        userId: user._id,
        weight: entry.weight,
        recordedAt: entry.recordedAt,
        notes: entry.notes,
        createdAt: entry.createdAt || new Date(),
        updatedAt: entry.updatedAt || new Date(),
      };
      const weightEntry = new WeightEntryModel(entryData);
      await weightEntry.save();
      seedData.weightEntries.push(weightEntry);
    }
    console.log(`✅ Seeded ${seedData.weightEntries.length} weight entries`);
  } catch (error) {
    console.error('❌ Error seeding weight entries:', error);
    throw error;
  }
}

async function seedMedications() {
  try {
    console.log('💊 Seeding medications...');
    // Uncomment and implement when Medication model is available
    // for (const med of realMedications) {
    //   const medication = new Medication(med);
    //   await medication.save();
    //   seedData.medications.push(medication);
    // }
    console.log('✅ Medications seeding skipped (implement when model is ready)');
  } catch (error) {
    console.error('❌ Error seeding medications:', error);
    throw error;
  }
}

async function seedShipments() {
  try {
    console.log('📦 Seeding shipments...');
    for (const shipment of realShipments) {
      const user = seedData.users.find(u => u.email === shipment.userEmail);
      if (!user) {
        console.warn('⚠️ User not found for shipment:', shipment);
        continue;
      }
      const shipmentData = {
        userId: user._id,
        items: shipment.items,
        status: shipment.status,
        trackingNumber: shipment.trackingNumber,
        shippedAt: shipment.shippedAt,
        deliveredAt: shipment.deliveredAt,
      };
      const shipmentDoc = new Shipment(shipmentData);
      await shipmentDoc.save();
      seedData.shipments.push(shipmentDoc);
    }
    console.log(`✅ Seeded ${seedData.shipments.length} shipments`);
  } catch (error) {
    console.error('❌ Error seeding shipments:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectToDatabase();
    await clearDatabase();
    
    await seedUsers();
    await seedWeightEntries();
    await seedMedications();
    await seedShipments();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${seedData.users.length}`);
    console.log(`  - Weight Entries: ${seedData.weightEntries.length}`);
    console.log(`  - Medications: ${seedData.medications.length}`);
    console.log(`  - Shipments: ${seedData.shipments.length}`);
    
    console.log('\n🔑 Demo Credentials:');
    console.log('  Email: patient@example.com');
    console.log('  Password: demo123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  main();
}

export { main as seedDatabase }; 