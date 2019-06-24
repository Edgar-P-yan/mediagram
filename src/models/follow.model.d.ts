import { Document, Model, Types } from 'mongoose';

interface Follow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
  createdAt: Date;
}

let follow: Model<Follow>;

export = follow;
