export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export interface Params {
  count: number;
}

export interface IProduct {
  _id: string;
  title: string;
  desc?: string;
  joint_purchase_information: string;
  image: string[];
  end: Date;
  cobuyers: mongoose.Types.ObjectId[];
  creator: mongoose.Types.ObjectId;
  price: number;
  category?: string;
  created_at: Date;
}


export interface ProductQueryResponse {
  data: {
    status: 'success' | 'error';
    results: number;
    data: IProduct[];
  }
}

export type PostingData = any;
