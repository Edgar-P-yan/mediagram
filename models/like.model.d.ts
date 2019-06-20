import { Document, Model, Types } from 'mongoose';

interface Like extends Document {
  post: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

let like: Model<Like>;

export = post;
