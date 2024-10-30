import { LikeOutlined, MessageFilled, StarTwoTone } from '@ant-design/icons';
import { List, Tag } from 'antd';
import React from 'react';
import type { ListItemDataType } from '../../data.d';
import ReviewListContent from '../ReviewListContent';
import useStyles from './index.style';

export type ReviewsProps = {
  data: ListItemDataType[],
}

const Articles: React.FC<ReviewsProps> = ({data: listData}) => {
  const { styles } = useStyles();
  const IconText: React.FC<{
    icon: React.ReactNode;
    text: React.ReactNode;
  }> = ({ icon, text }) => (
    <span>
      {icon} {text}
    </span>
  );

  return (
      <List<ListItemDataType>
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <IconText key="star" icon={<StarTwoTone />} text={item.star} />,
              <IconText key="like" icon={<LikeOutlined />} text={item.like} />,
              <IconText key="message" icon={<MessageFilled />} text={item.message} />,
            ]}
          >
            <List.Item.Meta
              title={
                <a className={styles.listItemMetaTitle} href={item.href}>
                  {item.title}
                </a>
              }
              description={
                <span>
                  {/* todo! add tag logic */}
                  <Tag>Food & Drinks</Tag>
                  <Tag>Areum-gwan</Tag>
                </span>
              }
            />
            <ReviewListContent data={item} />
          </List.Item>
        )}
      />
  );
};
export default Articles;
