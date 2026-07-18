import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    banner: string;
    date: Date;
    time: string;
    venue: string;
    category: string;
    registrationDeadline: Date;
    seatsAvailable: number;
    totalSeats: number;
    createdBy: mongoose.Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        banner: { type: String, default: '/images/default-event.jpg' },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        venue: { type: String, required: true },
        category: { type: String, required: true },
        registrationDeadline: { type: Date, required: true },
        seatsAvailable: { type: Number, required: true, min: 0 },
        totalSeats: { type: Number, required: true, min: 1 },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const Event = (mongoose.models.Event as mongoose.Model<IEvent>) || mongoose.model<IEvent>('Event', EventSchema);