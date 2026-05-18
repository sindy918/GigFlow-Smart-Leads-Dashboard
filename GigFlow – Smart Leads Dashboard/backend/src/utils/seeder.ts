import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gigflow';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    console.log('Cleared existing Users and Leads.');

    // Seed Demo Users
    const adminUser = await User.create({
      name: 'GigFlow Admin',
      email: 'admin@gigflow.com',
      password: 'Admin@123',
      role: 'Admin',
    });

    const salesUser = await User.create({
      name: 'GigFlow Sales',
      email: 'sales@gigflow.com',
      password: 'Sales@123',
      role: 'Sales User',
    });

    console.log('Demo Users seeded successfully:');
    console.log(`- Admin: ${adminUser.email} (Password: Admin@123)`);
    console.log(`- Sales: ${salesUser.email} (Password: Sales@123)`);

    // Seed Demo Leads (20 leads to demonstrate pagination)
    const baseDate = new Date();
    const leadsData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        status: 'Qualified',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
      },
      {
        name: 'Sarah Connor',
        email: 'sarah.connor@cyberdyne.com',
        status: 'New',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@corporation.com',
        status: 'Lost',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      },
      {
        name: 'Alice Johnson',
        email: 'alice.j@designco.com',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      },
      {
        name: 'Bob Miller',
        email: 'bob.miller@buildtech.com',
        status: 'Contacted',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.b@peanuts.org',
        status: 'New',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      },
      {
        name: 'David Beckham',
        email: 'david@beckhamsports.com',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
      },
      {
        name: 'Emma Watson',
        email: 'emma@watsonmedia.co.uk',
        status: 'New',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 9), // 9 days ago
      },
      {
        name: 'Frank Sinatra',
        email: 'frank@sinatramusic.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
      },
      {
        name: 'Grace Hopper',
        email: 'grace.hopper@navy.mil',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 11), // 11 days ago
      },
      {
        name: 'Henry Ford',
        email: 'henry@fordmotors.com',
        status: 'Lost',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
      },
      {
        name: 'Isaac Newton',
        email: 'isaac@gravityphysics.edu',
        status: 'New',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 13), // 13 days ago
      },
      {
        name: 'Judy Garland',
        email: 'judy@overtherainbow.org',
        status: 'Contacted',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
      },
      {
        name: 'Kevin Bacon',
        email: 'kevin@sixdegrees.com',
        status: 'Qualified',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
      },
      {
        name: 'Leonardo da Vinci',
        email: 'leo@renaissanceart.it',
        status: 'New',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 16), // 16 days ago
      },
      {
        name: 'Marie Curie',
        email: 'marie.curie@radiumlab.org',
        status: 'Qualified',
        source: 'Website',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 17), // 17 days ago
      },
      {
        name: 'Nikola Tesla',
        email: 'nikola@alternatingcurrent.com',
        status: 'Contacted',
        source: 'Referral',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 18), // 18 days ago
      },
      {
        name: 'Oscar Wilde',
        email: 'oscar@wildelit.com',
        status: 'Lost',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 19), // 19 days ago
      },
      {
        name: 'Pablo Picasso',
        email: 'pablo@cubismart.es',
        status: 'New',
        source: 'Instagram',
        createdAt: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
      },
    ];

    await Lead.insertMany(leadsData);
    console.log(`Successfully seeded ${leadsData.length} leads.`);

    // Disconnect DB
    await mongoose.disconnect();
    console.log('Database seeded successfully and connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during data seeding:', error);
    process.exit(1);
  }
};

seedData();
