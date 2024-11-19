import { LikeTwoTone, MessageFilled } from '@ant-design/icons';
import { List, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import type { ListItemDataType } from '../../data';
import ReviewListContent from '../ReviewListContent';
import useStyles from './index.style';
import { queryUser } from '../../service';

export type ReviewsProps = {
  data: ListItemDataType[],
  tab: 'given' | 'received',
}

type Review = {
  author: string;
  target: string;
  text: string;
  created_at: Date;
  targetUser: {
    status: string;
    data: API.CurrentUser;
  };
}

const Articles: React.FC<ReviewsProps> = ({ data: listData, tab }) => {
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
      key={`${tab}`}
      rowKey={(item) => `${item.author}-${item.created_at}-${tab}`}
      itemLayout="vertical"
      dataSource={listData}
      renderItem={(item) => {

        // const { data: creatorData, loading: creatorLoading, run: creatorRun } = useRequest((values: any) => {
        //   // todo! filter
        //   console.log('form data', values);
        //   return queryUser({
        //     id: product.creator,
        //   });
        // });

        return (
          <List.Item
            key={`${item.author}-${item.created_at}-${tab}`}
            actions={[
              <IconText key="like" icon={<LikeTwoTone />} text={item.like} />,
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
            <ReviewListContent key={`${item.author}-${item.created_at}-${tab}`} data={item} targetUser={item.targetUser} />
          </List.Item>
        )
      }}
    />
  );
};
export default Articles;
