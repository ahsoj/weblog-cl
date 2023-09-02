import { Session } from './interface';

export type Role = 'USER' | 'ADMIN';

export type User = Readonly<{
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  emailVerified: Date;
  createdAt: Date;
  updatedAt: Date;
  bio?: string;
  profileUrl?: string;
  role: Role;
  followers: {
    id: string;
    username: string;
    profileUrl: string;
  }[];
  followings: {
    id: string;
    username: string;
    profileUrl: string;
  }[];
  _count?: {
    followers: number;
    following: number;
    post: number;
  };
}>;

export type Article = {
  id?: string;
  title: string;
  slug: string;
  content: Object;
  imageUrl?: string;
  published?: boolean;
  createdAt?: string;
  authorId: string;
  author?: Author;
  comment?: number | string | any;
  like?: number | string | any;
  tag?: any;
  _count: Readonly<{ comment: number; like: number; saved?: number }>;
};

export type Author = {
  id: string;
  username: string;
  email: string;
  bio?: string;
  _count?: {
    post: number;
    followers: number;
  };
  profileUrl?: string;
};

export type Image = {
  id: string;
  publicId: string;
  format: string;
  version: string;
  // post: Article
};

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: JSON;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    commentLike: number;
  };
}

export type ISODateString = string;

export type UpdateSession = (data?: any) => Promise<Session | null>;

export type TabsType = 'line' | 'card' | 'editable-card';
export type SizeType = 'small' | 'middle' | 'large' | undefined;
