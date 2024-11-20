import { Link, useModel, useParams, useRequest } from '@umijs/max';
import {
	Card,
	Carousel,
	Col,
	Divider,
	Image,
	Row,
	Typography,
	Space,
	Avatar,
	Button,
	Modal,
	message,
	Skeleton,
} from 'antd';
import { createChatForTwo, queryProducts, queryUser, requestToJoinDeal } from './service';
import React, { useContext, useEffect, useState } from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { ChatContext } from '@/ChatContext';

const { Title, Paragraph, Text } = Typography;

const Product: React.FC = () => {
	const { setChatOpen } = useContext(ChatContext);

	const { productId } = useParams();

	const { initialState } = useModel('@@initialState');
	const { currentUser } = initialState || {};

	const { data: productData, loading: productLoading } = useRequest(() =>
		queryProducts({ productId })
	);
	const product = productData?.data || {
		title: '',
		image: [''],
		desc: '',
		price: '',
		joint_purchase_information: '',
		creator: '',
	};

	const { data: creatorData, run: creatorRun, loading: creatorLoading } = useRequest(() => {
		if (product.creator === '') return;
		return queryUser({ id: product.creator });
	});

	useEffect(() => {
		creatorRun();
	}, [productLoading])

	const creator = creatorData?.data;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [requestStatus, setRequestStatus] = useState(false);

	const onChatButtonClick = () => {
		createChatForTwo({
			targetId: creator?._id,
		});
		setChatOpen(true);		
	}

	const handleRequestToJoin = async () => {
		setLoading(true);
		try {
			if (productId === undefined) { throw new Error('productId is undefined') }
			const response = await requestToJoinDeal(productId);
			if (response.status === 'success') {
				message.success('Request submitted successfully!');
				setRequestStatus(true);
			} else {
				message.error('Failed to submit request. Please try again.');
			}
		} catch (error) {
			message.error('An error occurred while submitting your request.');
		} finally {
			setLoading(false);
			setIsModalOpen(false);
		}
	};

	const handleCancelRequest = async () => {
		setLoading(true);
		try {
			if (productId === undefined) { throw new Error('productId is undefined') }
			const response = await requestToJoinDeal(productId);
			if (response.status === 'success') {
				message.success('Request canceled successfully!');
				setRequestStatus(false);
				message.error('Failed to cancel request. Please try again.');
			}
		} catch (error) {
			message.error('An error occurred while canceling your request.');
		} finally {
			setLoading(false);
			setIsModalOpen(false);
		}
	};

	// if (productLoading || creatorLoading) {
	// 	return <Spin size="large" />;
	// }

	return (
		<>
			<Card>
				<Row gutter={24}>
					<Col lg={10} md={24}>
						<div style={{ padding: '20px' }}>
							<Carousel arrows autoplay>
								{product.image.map((img, index) => (
									<Image key={index} src={img} />
								))}
							</Carousel>
						</div>
					</Col>

					<Col lg={14} md={24}>
						<Typography>
							<Title level={2}>{product.title}</Title>
							{!creator &&
								<Space>
									<Skeleton.Avatar active />
									<Skeleton.Input active size='small' />
								</Space>
							}
							{creator &&
								<Space size='large'>
									<Link to={`/account/center/${creator._id}`}>
										<Space>
											<Avatar src={creator.profile_picture} />
											<Text>{`${creator.first_name} ${creator.last_name}`}</Text>
										</Space>
									</Link>
									{/* todo! hide when your own product */}
									{
										currentUser && (currentUser._id !== creator._id) && <Button
											icon={<CommentOutlined />}
											type='primary'											// size='small'
											onClick={onChatButtonClick}
										>
											Chat with Host
										</Button>}
								</Space>
							}
							<Divider />
							<Text
								style={{
									fontSize: '20px',
									color: 'rgba(208, 1, 27, 1)',
									marginBottom: '16px',
									display: 'block',
								}}
							>
								<b>{`${product.price} KRW`}</b>
							</Text>
						</Typography>

						<Typography>
							<Title level={4} style={{ marginTop: '20px' }}>
								Joint Purchase Details
							</Title>
							<Paragraph>{product.joint_purchase_information || 'No details available.'}</Paragraph>
						</Typography>

						{
							requestStatus
								? <Button
									type="default"
									style={{ marginTop: 20 }}
									onClick={() => setIsModalOpen(true)}
								>
									{requestStatus ? 'Cancel Request' : 'Request to Join Deal'}
								</Button>
								: <Button
									type="primary"
									style={{ marginTop: 20 }}
									onClick={() => setIsModalOpen(true)}
								>
									{requestStatus ? 'Cancel Request' : 'Request to Join Deal'}
								</Button>
						}

						<Typography>
							<Title level={4} style={{ marginTop: '20px' }}>
								Description
							</Title>
							<Paragraph>{product.desc || 'No description available.'}</Paragraph>
						</Typography>
					</Col>
				</Row>
			</Card>

			<Modal
				open={isModalOpen}
				title={requestStatus ? 'Cancel Request' : 'Request to Join Deal'}
				onCancel={() => setIsModalOpen(false)}
				footer={[
					<Button
						key="submit"
						type="primary"
						loading={loading}
						onClick={requestStatus ? handleCancelRequest : handleRequestToJoin}
					>
						Submit
					</Button>,
				]}
			>
				<p>
					{requestStatus
						? 'Are you sure you want to cancel your request?'
						: 'Would you like to join this deal? The host will be notified after you submit the request.'}
				</p>
			</Modal>
		</>
	);
};


export default Product;