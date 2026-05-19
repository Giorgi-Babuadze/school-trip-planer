import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import Tour from '../models/Tour';
import User from '../models/User';

dotenv.config();

const seedData = [
  {
    title: 'ამაჯის ხეობა - 3 დღეს',
    description: 'დაიმალე მოჯავის ხეობაში ნაწილის მოსახლეობის სასუფევლებში და აღმოჩნდი ისტორიის გულში.',
    destination: 'ამაჯის ხეობა',
    price: 150,
    duration: 3,
    maxParticipants: 50,
    startDate: new Date('2026-03-15'),
    endDate: new Date('2026-03-18'),
    image: 'https://via.placeholder.com/400x300?text=Amaji+Valley',
    itinerary: [
      'დღე 1: მისვლა და მცირე ფეხით სიარული',
      'დღე 2: უძველესი სოფლების მონახულება',
      'დღე 3: დაბრუნება და წასვლა',
    ],
    includes: [
      'ტრანსპორტი',
      'საჭმელი',
      'სამკიდე მოწვევა',
      'სამედიცინო დახმარება',
    ],
  },
  {
    title: 'ვარძიის ციხე - 2 დღე',
    description: 'ისტორიული ვარძიის ციხის მონახულება და ისტორიის გაცნობა.',
    destination: 'ვარძია',
    price: 80,
    duration: 2,
    maxParticipants: 60,
    startDate: new Date('2026-04-10'),
    endDate: new Date('2026-04-12'),
    image: 'https://via.placeholder.com/400x300?text=Vardzia+Fortress',
    itinerary: [
      'დღე 1: მონაკუტანი სამონასტრო კომპლექსი',
      'დღე 2: გამოსაკვლევი უძველესი მწიკიტები',
    ],
    includes: [
      'ტრანსპორტი',
      'საჭმელი',
      'გიდი',
      'შესასვლელი',
    ],
  },
  {
    title: 'თბილისის არქეოლოგია - 1 დღე',
    description: 'თბილისის ისტორიული ღირსშესამჩნეველი ადგილების მონახულება და გაცნობა.',
    destination: 'თბილისი',
    price: 45,
    duration: 1,
    maxParticipants: 100,
    startDate: new Date('2026-05-05'),
    endDate: new Date('2026-05-05'),
    image: 'https://via.placeholder.com/400x300?text=Tbilisi+Tour',
    itinerary: [
      'დღე 1: მეტეხი, ნაროყვის ციხე, კალა გასაჰტომი',
    ],
    includes: [
      'ტრანსპორტი',
      'კვნელი',
      'გიდი',
    ],
  },
  {
    title: 'ბორჯომის ხეობა - 2 დღე',
    description: 'ბორჯომის ხეობამ ცნობილი მის ბუნებრივი სილამაზე და მინერალური წყლებით.',
    destination: 'ბორჯომი',
    price: 100,
    duration: 2,
    maxParticipants: 70,
    startDate: new Date('2026-06-10'),
    endDate: new Date('2026-06-12'),
    image: 'https://via.placeholder.com/400x300?text=Borjomi+Valley',
    itinerary: [
      'დღე 1: ბორჯომის ცენტრალური პარკი და მინერალური წყალი',
      'დღე 2: გემოსითი პეშოვან და მოვანო',
    ],
    includes: [
      'ტრანსპორტი',
      'საჭმელი',
      'სპა სერვისი',
      'გიდი',
    ],
  },
  {
    title: 'სვანეთის დასაფეთო - 5 დღე',
    description: 'უძველესი სვანური კულტურა, ღორგა და ტრადიციული ღირსშესამჩნეველი ადგილები.',
    destination: 'სვანეთი',
    price: 400,
    duration: 5,
    maxParticipants: 40,
    startDate: new Date('2026-07-20'),
    endDate: new Date('2026-07-25'),
    image: 'https://via.placeholder.com/400x300?text=Svaneti+Tour',
    itinerary: [
      'დღე 1: მუშკი',
      'დღე 2-3: ბენი სიკლო',
      'დღე 4: ხელმზე ეშმკოვი',
      'დღე 5: დაბრუნება',
    ],
    includes: [
      'ტრანსპორტი',
      'საჭმელი',
      'საცხობი',
      'გიდი',
      'სამედიცინო დახმარება',
    ],
  },
];

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-trip-planner';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Tour.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing tours and users');
    
    // Insert tour data
    await Tour.insertMany(seedData);
    console.log(`✅ Added ${seedData.length} tours to the database`);
    
    // Create admin user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('4dm1n123!@#', salt);
    
    const adminUser = new User({
      email: 'admin@schooltrip.ge',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });
    
    await adminUser.save();
    console.log('👤 Admin account created:');
    console.log('   📧 Email: admin@schooltrip.ge');
    console.log('   🔑 Password: 4dm1n123!@#');
    
    console.log('\n✅ Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
