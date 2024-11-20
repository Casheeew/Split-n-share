export type tabKeyType = 'received_reviews' | 'given_reviews' | 'postings';

export interface UserParams {
  id: string;
}

export interface TagType {
  key: string;
  label: string;
}

export type GeographicType = {
  province: {
    label: string;
    key: string;
  };
  city: {
    label: string;
    key: string;
  };
};

export type NoticeType = {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
};

export type CurrentUser = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  desc?: string;
  dorm?: string;
  department?: string;
  profile_picture?: string;
  given_reviews: string[];
  received_reviews: string[];
  join_date: Date;
};

export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type ListItemDataType = {
  author: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  text: string;
  created_at: Date;
  rating: number;
  likes: number;
};

export type ReviewData = any;