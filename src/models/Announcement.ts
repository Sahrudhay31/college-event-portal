import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    createdBy: mongoose.Types.ObjectId;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);
export const Announcement = (mongoose.models.Announcement as mongoose.Model<IAnnouncement>) || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);