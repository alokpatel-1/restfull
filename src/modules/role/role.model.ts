import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    permissions: {
      type: [String],
      default: [],
      trim: true,
    },
  },
  { timestamps: true }
);

export const RoleModel = mongoose.model<IRole>('Role', roleSchema);
