import { Document, Model, Types } from 'mongoose';

interface Post extends Document {
  text: string;
  author: Types.ObjectId;
  photoId: string;
  createdAt: Date;
}

let post: Model<Post>;

export = post;
