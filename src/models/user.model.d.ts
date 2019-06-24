import { Document, Model } from 'mongoose';

interface User extends Document {
  username: string;
  bio: string;
  createdAt: Date;
  photoId: string;
  providers: {
    vk: {
      userId: string;
      accessToken: string;
    };
  };
}

let user: Model<User>;

export = user;
