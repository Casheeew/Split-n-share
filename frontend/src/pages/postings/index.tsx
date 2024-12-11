import { Link, useIntl, useModel, useRequest } from '@umijs/max';
import {
	Affix,
	Button,
	Card,
	Col,
	Form,
	Image,
	message,
	Modal,
	Row,
	Space,
	Table,
	Tag,
} from 'antd';
import React, { useContext, useState } from 'react';
import type { GetProp, TableProps, UploadProps } from 'antd';
import { createProductPosting as apiCreateProductPosting, approveToJoinDeal, createProductChat, declineToJoinDeal, deletePosting, queryUserProducts } from './service';
import CreatePostingModalForm from './components/ModalForm';
import FilterMenu from '../browse/products/components/Filter';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import jwt from 'jsonwebtoken';
import AvatarList from '../account/center/components/AvatarList';
import { ChatContext } from '@/ChatContext';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

interface PostingDataType {
	key: string;
	post: string;
	price: number;
	category: string;
}

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const tabList = [
	{
		key: 'ongoing',
		tab: 'Ongoing Postings',
	},
	{
		key: 'ended',
		tab: 'Ended Postings',
	},
];

// const data: PostingDataType[] = [
// 	{
// 		key: '1',
// 		post: 'Shin Ramen',
// 		price: 32000,
// 		category: 'food_drink',
// 	},
// ];


const Product: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const { currentUser } = initialState || {};
	const [modalOpen, setModalOpen] = useState(false);
	const [approveUserModalOpenId, setApproveUserModalOpenId] = useState('');
	const [activeTabKey, setActiveTabKey] = useState<string>('ongoing');
	const [filterOptions, setFilterOptions] = useState<any>({});
	const intl = useIntl();
	const {setChatOpen} = useContext(ChatContext);

	const token = localStorage.getItem('token')?.split(" ")[1];

	const decoded = token !== undefined ? jwt.decode(token) as any : { id: undefined };
	const currentUserId = decoded.id;

	//  获取用户信息
	const { data: productsData, loading, refresh } = useRequest(() => {
		return queryUserProducts(currentUserId);
	});

	const columns: TableProps<PostingDataType>['columns'] = [
		{
			title: 'Created At',
			dataIndex: 'created_at',
			width: '10%',
			key: 'created_at',
			render: (created_at) => {
				// todo!
				return (
					<small>{dayjs(created_at).format('ll')}</small>
				)
			}
		},
		{
			title: 'Post',
			dataIndex: 'title',
			key: 'post',
			width: '22.5%',
			render: (title, { image, end, price, _id }) => {


				const endsInString =
					((new Date(end)).getTime() <= Date.now() ? 'ended' : 'ends')
					+ ' '
					+ `${dayjs(end).fromNow()}`;

				return (
					<>
						<Space>
							<Image width={50} src={image[0]} />
							{/* <a>{text}</a> */}
							<div>
								<Link to={`/products/${_id}`}>
									{title}
								</Link>
								<div><b>₩{price}</b> <small>({endsInString})</small></div>
							</div>
						</Space>
					</>
				)
			},
		},
		{
			title: 'Approved Co-buyers',
			dataIndex: 'cobuyers',
			width: '15%',
			key: 'cobuyers',
			render: (cobuyers) => {
				// todo!
				return (
					<AvatarList size="small">
						{cobuyers.map((member: any) => {
							return <AvatarList.Item
								key={member._id}
								src={member.profile_picture} // todo!
								tips={`${member.first_name} ${member.last_name}`} // todo!
							/>
						})}
					</AvatarList>
				)
			}
		},
		{
			title: 'Pending Co-buyers',
			dataIndex: 'cobuyers_queue',
			width: '15%',
			key: 'cobuyers_queue',
			render: (cobuyers_queue, {_id}) => {
				// todo!
				return (
					<><AvatarList size="small">
						{cobuyers_queue.map((member: any) => {
							// console.log('-----------------');
							// console.log(cobuyers_queue);
							return (<><AvatarList.Item
								onClick={() => {
									setApproveUserModalOpenId(member._id);
								}}
								key={member._id}
								src={member.profile_picture} // todo!
								tips={`Click to approve or decline ${member.first_name} ${member.last_name}`} // todo!
							/><Modal
									open={approveUserModalOpenId === member._id}
									title="Approve this user to join your deal?"
									onOk={() => {
										setApproveUserModalOpenId('');
									}}
									onCancel={() => {
										setApproveUserModalOpenId('');
									}}
									footer={[
										<Button key="back" onClick={() => {
											setApproveUserModalOpenId('');
										}}>
											Return
										</Button>,
										<Button key="decline" type="primary" onClick={async () => {
											await declineToJoinDeal(_id, member._id);
											refresh();
											message.success('Declined user');
											setApproveUserModalOpenId('');

										}}>
											Decline
										</Button>,
										<Button
											key="accept"
											type="primary"
											onClick={async () => {
												await approveToJoinDeal(_id, member._id);
												refresh();
												message.success('Approved user');
												setApproveUserModalOpenId('');
											}}
										>
											Approve
										</Button>,
									]}
								/></>)
						})}
					</AvatarList>
					</>
				)
			}
		},
		{
			title: 'Category',
			key: 'category',
			dataIndex: 'category',
			width: '10%',
			render: (_, { category }) => {
				let color = category.length > 10 ? 'geekblue' : 'green';
				if (category === 'food_drink') {
					color = 'volcano';
				}
				return (
					<Tag color={color} key={category}>
						{category.toUpperCase()}
					</Tag>
				)
			},
		},
		{
			title: 'Actions',
			key: 'action',
			width: '15%',
			render: (_, { _id }) => (
				<div>
					<div><Button type="link" onClick={async () => {
						await deletePosting(_id);
						refresh();
						message.success('Successfully deleted post!');
					}}>Delete Posting</Button></div>
					<div><Button type="link" onClick={() => {
						setChatOpen(true);
					}}>Open Group Chat</Button></div>
				</div>
				// <Space size="middle">
				// 	<a>End Posting</a>
				// 	<a>Delete Posting</a>
				// 	<a>Open Group Chat</a>
				// </Space>
			),
		},
	];


	const filter = (data: any, options: any) => {
		if (options.category === 'all') {
			delete options.category;
		}
		if (options.dorm === 'all') {
			delete options.dorm;
		}

		return data.filter((product: any) => {
			return !options.category || (product.category === options.category)
		}).filter((product: any) => {
			return !options.dorm || (product.dorm === options.dorm)
		}).filter((product: any) => {
			const ended = (new Date(product.end)).getTime() <= Date.now();

			const filter = activeTabKey === 'ended' ? ended : !ended;
			return filter;
		});
	}

	const productsList = filter(productsData || [], filterOptions);
	console.log(productsList);

	const onTabChange = (key: string) => {
		setActiveTabKey(key);
	};

	const showModal = () => {
		setModalOpen(true);
	}

	const handleModalCancel = () => {
		setModalOpen(false);
	}

	const { loading: submitting, run: createProductPosting } = useRequest<{
		data: any;
	}>(apiCreateProductPosting, {
		manual: true,
		onSuccess: async (data) => {
			if (data.status === 'success') {
				message.success('Created successfully!');
			}
			else {
				console.error('An error occurred.');
			}
		},
	});

	const getBase64 = (file: FileType): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});

	const onFinish = async (values: Store) => {
		// console.log(values);
		// todo! fill values with owner id and so on
		// todo! reset on submit

		values.image = await Promise.all(
			values.image.map(
				async (file: any) => {
					if (!file.url && !file.preview) {
						const img = await getBase64(file.originFileObj as FileType);
						return img as string;
					}
					return file.url;
				}
			));
		values.creator = currentUser?._id;
		const product = (await createProductPosting(values)).data;
		await createProductChat({
			productId: product._id,
		});
	}

	const handleFilterMenuClick = (value: any) => {
		setFilterOptions((options: any) => ({ ...options, category: value.key }));
	}


	return (
		<>
			<Row gutter={24}>
				<Col span={1}>
				</Col>
				<Col span={4}>
					<Affix offsetTop={24}>
						<FilterMenu onClick={handleFilterMenuClick} />
					</Affix>
				</Col>
				<Col span={18}>
					<Card
						title="My Postings"
						extra={
							<Button size="large" type="primary" onClick={showModal}>Create Posting</Button>
						}
						tabList={tabList}
						activeTabKey={activeTabKey}
						onTabChange={onTabChange}
					>
						<Table<PostingDataType> loading={loading} columns={columns} dataSource={productsList.reverse()} />
					</Card>
					<Form.Provider
						onFormFinish={async (name, { values }) => {
							if (name === 'createPostingForm') {
								await onFinish(values);
								refresh();
								setModalOpen(false);
							}
						}}
					>
						<CreatePostingModalForm
							open={modalOpen}
							onOk={(form) => {
								form.submit();
							}}
							onCancel={handleModalCancel}
							loading={submitting}
						/>
					</Form.Provider >
				</Col>
			</Row>
		</>
	);
};


export default Product;