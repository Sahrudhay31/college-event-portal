import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// We define minimal schemas here to avoid import issues with Next.js edge runtime mixed with Node.js in the script
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
});

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    banner: String,
    date: Date,
    time: String,
    venue: String,
    category: String,
    registrationDeadline: Date,
    seatsAvailable: Number,
    totalSeats: Number,
    createdBy: mongoose.Schema.Types.ObjectId,
});

const announcementSchema = new mongoose.Schema({
    title: String,
    content: String,
    priority: { type: String, default: 'low' },
    createdBy: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('Connected!');

        console.log('Clearing existing events and announcements...');
        await Event.deleteMany({});
        await Announcement.deleteMany({});

        console.log('Creating admin user...');
        let admin = await User.findOne({ email: 'admin@college.edu' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@college.edu',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Created Admin account: admin@college.edu / password123');
        }

        console.log('Creating dummy events...');
        const futureDate1 = new Date();
        futureDate1.setDate(futureDate1.getDate() + 10);
        const deadline1 = new Date();
        deadline1.setDate(deadline1.getDate() + 8);

        const futureDate2 = new Date();
        futureDate2.setDate(futureDate2.getDate() + 20);
        const deadline2 = new Date();
        deadline2.setDate(deadline2.getDate() + 15);

        const futureDate3 = new Date();
        futureDate3.setDate(futureDate3.getDate() + 5);
        const deadline3 = new Date();
        deadline3.setDate(deadline3.getDate() + 3);

        await Event.insertMany([
            {
                title: 'TechNova 2026 Hackathon',
                description: 'Join us for a 48-hour coding marathon. Build innovative solutions, win exciting prizes, and get a chance to be recruited by top tech companies!',
                banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
                date: futureDate1,
                time: '09:00',
                venue: 'Main Auditorium',
                category: 'Technical',
                registrationDeadline: deadline1,
                seatsAvailable: 150,
                totalSeats: 150,
                createdBy: admin._id
            },
            {
                title: 'Annual Cultural Fest: Symphony',
                description: 'Experience the magic of music, dance, and art. Featuring guest performances, food stalls, and a battle of the bands!',
                banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800',
                date: futureDate2,
                time: '17:00',
                venue: 'College Grounds',
                category: 'Cultural',
                registrationDeadline: deadline2,
                seatsAvailable: 500,
                totalSeats: 500,
                createdBy: admin._id
            },
            {
                title: 'AI & Future of Work Seminar',
                description: 'A deep dive into how Artificial Intelligence is reshaping the modern workplace. Guest speaker: Dr. Alan Turing.',
                banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
                date: futureDate3,
                time: '14:00',
                venue: 'Seminar Hall B',
                category: 'Seminar',
                registrationDeadline: deadline3,
                seatsAvailable: 25, // Getting full
                totalSeats: 100,
                createdBy: admin._id
            }
        ]);

        console.log('Creating announcements...');
        await Announcement.insertMany([
            {
                title: 'Campus Tech Challenge Round 2 Update',
                content: 'Congratulations to all students who submitted their phase 1 assignments. The reviewers will evaluate your dashboard designs shortly. Best of luck!',
                priority: 'high',
                createdBy: admin._id
            },
            {
                title: 'Library Hours Extended',
                content: 'The central library will now remain open until 11:00 PM during the mid-semester examination weeks.',
                priority: 'low',
                createdBy: admin._id
            }
        ]);

        console.log('Seeding complete! You can now log in as admin@college.edu / password123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();
