import { useModel } from '@umijs/max';
import {
	Button,
	Card,
	Table,
	Tag,
	Typography,
} from 'antd';
import React, { useState } from 'react';
import { CommentOutlined } from '@ant-design/icons';
import { ChatContext } from '@/ChatContext';
import type { TableProps } from 'antd';

interface PostingDataType {
	key: string;
	post: string;
	price: number;
	category: string;
}

const columns: TableProps<PostingDataType>['columns'] = [
	{
		title: 'Post',
		dataIndex: 'post',
		key: 'post',
		render: (text) => <a>{text}</a>,
	},
	{
		title: 'Price',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: 'Category',
		key: 'category',
		dataIndex: 'category',
		width: '5%',
		render: (_, { category }) => {
			let color = category.length > 5 ? 'geekblue' : 'green';
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
];

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

const data: PostingDataType[] = [
	{
		key: '1',
		post: 'Shin Ramen',
		price: 32000,
		category: 'food_drink',
	},
];


const Product: React.FC = () => {
	const { initialState } = useModel('@@initialState');
	const { currentUser } = initialState || {};

	const [activeTabKey, setActiveTabKey] = useState<string>('ongoing');

	const onTabChange = (key: string) => {
		setActiveTabKey(key);
	};

	return (
		<>
			<Card
				title="My Postings"
				extra={
					<Button size="large" type="primary">Create Posting</Button>
				}
				tabList={tabList}
				activeTabKey={activeTabKey}
				onTabChange={onTabChange}
			>
				<Table<PostingDataType> columns={columns} dataSource={data} />
			</Card>
		</>
	);
};


export default Product;