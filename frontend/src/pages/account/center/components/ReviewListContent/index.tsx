import { Avatar } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import useStyles from './index.style';

export type ReviewProps = {
  data: {
    text?: string;
    created_at?: any;
    href?: string;
  };
  targetUser: any
};
// todo!
const ReviewListContent: React.FC<ReviewProps> = ({
  data: { text, created_at, href }, targetUser
}) => {
  const { styles } = useStyles();
  // todo! move avatar to title, move the posting to the bottom
  return (
    <div>
      <div className={styles.description}>{text}</div>
      <div className={styles.extra}>
        {/* <Avatar src={targetUser.profile_picture} size="small" />
        <a href={href}>{`${targetUser.first_name} ${targetUser.last_name}`}</a> left a review */}
        <em>{dayjs(created_at).format('YYYY-MM-DD HH:mm')}</em>
      </div>
    </div>
  );
};
export default ReviewListContent;
