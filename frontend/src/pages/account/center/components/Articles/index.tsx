import { LikeFilled, LikeOutlined, LikeTwoTone } from '@ant-design/icons';
import { Button, List, Space, Tooltip } from 'antd';
import React, { useState } from 'react';
import type { ListItemDataType } from '../../data';
import ReviewListContent from '../ReviewListContent';
import useStyles from './index.style';

export type ReviewsProps = {
  data: ListItemDataType[];
  tab: 'given' | 'received';
  targetUsers: API.CurrentUser[];
}

const Articles: React.FC<ReviewsProps> = ({ data: listData, tab, targetUsers }) => {
  const [like, setLike] = useState(false);
  const { styles } = useStyles();

  const IconText: React.FC<{
    icon: React.ReactNode;
    text: React.ReactNode;
    onClick: any;
  }> = ({ icon, text, onClick }) => (
    <Space onClick={onClick}>
      {icon} {`${text} likes`}
    </Space>
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

        const targetUser = targetUsers.find((user) => tab === 'received' ? item.author === user._id : item.target === user._id)

        const likeButton = (<Tooltip title="like" >
          <Button size='small' shape="circle" icon={<LikeOutlined />} />
        </Tooltip >)

        const cancelLikeButton = (<Tooltip title="liked" >
          <Button size='small' shape="circle" icon={<LikeFilled />} />
        </Tooltip >)

        return (
          <List.Item
            key={`${item.author}-${item.created_at}-${tab}`}
            actions={[
              <div
                style={{
                  display: 'flex',
                  height: 26,
                }}
                key="likeDiv"
              >
                <IconText onClick={() => {
                  setLike((value) => !value);
                }} key="like" icon={like ? likeButton : cancelLikeButton} text={item.likes} />
              </div>,
              // <IconText key="message" icon={<MessageFilled />} text={item.message} />,
            ]}
          >
            {/* <List.Item.Meta
              title={
                <a className={styles.listItemMetaTitle} href={item.href}>
                  {item.title}
                </a>
              }
              description={
                <span>
                  <Tag>Food & Drinks</Tag>
                  <Tag>Areum-gwan</Tag>
                </span>
              }
            /> */}

            {targetUser && <ReviewListContent key={`${item.author}-${item.created_at}-${tab}`} data={item} targetUser={targetUser} />}
          </List.Item>
        )
      }}
    />
  );
};
export default Articles;
