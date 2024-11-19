import { useParams, useRequest } from '@umijs/max';
import { Card, Carousel, Col, Divider, Image, Row, Typography } from 'antd';
import { queryProducts, queryUser } from './service';
import React from 'react';

const { Title } = Typography;

const Product: React.FC = () => {

	const { data: productData, loading: productLoading, run: productRun } = useRequest((values: any) => {
		// todo! filter
		console.log('form data', values);
		return queryProducts({
			productId,
			count: 8,
		});
	});

	const { productId } = useParams();
	const product = productData?.data || { title: '', image: [''], creator: '' };

	const { data: creatorData, loading: creatorLoading, run: creatorRun } = useRequest((values: any) => {
		// todo! filter
		console.log('form data', values);
		return queryUser({
			id: product.creator,
		});
	});

	return (
		<>
			{/* breadcrumb */}
			<Card>
				<Row gutter={24}>
					<Col lg={10} md={24}>
						<div style={{
							padding: '60px 32px 0px 32px',
						}}>
							<Carousel arrows autoplay>

								{
									product.image.map((img) => {
										return <Image key={img} src={img} />
									})
								}
							</Carousel>
						</div>
					</Col>
					<Col lg={14} md={24}>
						<Typography>
							<Title level={2}>{product.title}</Title>
						</Typography>

						<Divider />
					</Col>
				</Row>
			</Card >
		</>
	);
};
export default Product;
