import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
    userId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    registrationDate: Date;
    status: 'registered' | 'cancelled' | 'attended';
    qrCode: string;
}

const RegistrationSchema = new Schema<IRegistration>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        registrationDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['registered', 'cancelled', 'attended'], default: 'registered' },
        qrCode: { type: String, default: '' },
    },
    { timestamps: true }
);

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export const Registration = (mongoose.models.Registration as mongoose.Model<IRegistration>) || mongoose.model<IRegistration>('Registration', RegistrationSchema);