import { Card, List, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import type { ListItemDataType } from '../../data.d';
import AvatarList from '../AvatarList';
import useStyles from './index.style';
import { Link, useIntl } from '@umijs/max';
dayjs.extend(relativeTime);

export type ProjectsProps = {
  data: IProduct[],
  loading: boolean,
} 

const { Paragraph, Text } = Typography;

export interface IProduct {
  _id: string;
  title: string;
  desc?: string;
  joint_purchase_information: string;
  image: string[];
  end: Date;
  cobuyers: string[];
  creator: string;
  price: number;
  category?: string;
  created_at: Date;
}

const getKey = (id: string, index: number) => `${id}-${index}`;

const Projects: React.FC<ProjectsProps> = ({data: listData, loading}) => {
  const { styles } = useStyles();

  console.log('data', listData);

  const intl = useIntl();

  return (
    <List<IProduct>
      rowKey="_id"
      loading={loading}
      grid={{
        gutter: 12,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      dataSource={listData}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/products/${item._id}`}>
            <Card
              className={styles.card}
              hoverable
              cover={
                <div style={{ overflow: "hidden", width: "100%", height: "170px" }}>
                  <img alt={item.title} style={{ width: "100%" }}
                    src={item.image[0]}
                  />
                </div>
              }
            >
              <Card.Meta
                title={<a>{item.title}</a>}
                description={
                  <>
                    <Text style={{ color: 'rgba(208, 1, 27, 1)' }}>
                      <b>
                        {`${intl.formatNumber(item.price)} KRW`}
                      </b>
                    </Text>
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                      }}
                    >
                      {item.joint_purchase_information}
                    </Paragraph>
                  </>
                }
              />
              <div className={styles.cardItemContent}>
                <span>{dayjs(item.end).fromNow()}</span>
                <div className={styles.avatarList}>
                  <AvatarList size="small">
                    {item.cobuyers.map((member, i) => (
                      <AvatarList.Item
                        key={getKey(item._id, i)}
                        src={member.avatar} // todo!
                        tips={member.name} // todo!
                      />
                    ))}
                  </AvatarList>
                </div>
              </div>
            </Card>
          </Link>
        </List.Item>
      )}
    />
  );
};
export default Projects;
