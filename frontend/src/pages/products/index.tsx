import { useParams } from '@umijs/max';
import { Col, Image, Row } from 'antd';
import type { IProduct } from './types';
import React from 'react';

const fakeProduct: IProduct = {
  name: 'Shin Ramen, 120g, 32 packs',
  image: 'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  desc: 'Delicious Ramen from the other side of the world.',
  end: new Date(new Date().getTime() + 1000 * 60 * 60 * 2).getTime(),
  creator: 'Jane Doe',
  price: 10000,
  category: 'food_drink',
  created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime(),
};

const Product: React.FC = () => {
  const { productId } = useParams();
  console.log(productId);

  return (
    <>
      {/* breadcrumb */}
      <Row gutter={24}>
        <Col lg={12} md={24}>
          {/* <Image /> */}
        </Col>
      </Row>
    </>
  );
};
export default Product;
