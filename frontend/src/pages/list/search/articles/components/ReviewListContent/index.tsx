import { Avatar } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import useStyles from './index.style';

// any changes to this page is also needed in accounts center

type ReviewListContentProps = {
  data: {
    content: React.ReactNode;
    updatedAt: number;
    avatar: string;
    owner: string;
    href: string;
  };
};
const ReviewListContent: React.FC<ReviewListContentProps> = ({
  data: { content, updatedAt, avatar, owner, href },
}) => {
  const { styles } = useStyles();
  return (
    <div>
      <div className={styles.description}>{content}</div>
      <div className={styles.extra}>
        <Avatar src={avatar} size="small" />
        <a href={href}>{owner}</a> left a review
        <em>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm')}</em>
      </div>
    </div>
  );
};
export default ReviewListContent;
