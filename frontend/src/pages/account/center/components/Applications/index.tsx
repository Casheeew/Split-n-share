import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Dropdown, List, Tooltip } from 'antd';
import numeral from 'numeral';
import React from 'react';
import type { ListItemDataType } from '../../data.d';
import useStyles from './index.style';

export type ApplicationsProps = {
  data: ListItemDataType[],
} 

export function formatWan(val: number) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';
  let result: React.ReactNode = val;
  if (val > 10000) {
    result = (
      <span>
        {Math.floor(val / 10000)}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

const Applications: React.FC<ApplicationsProps> = ({data: listData}) => {
  const { styles: stylesApplications } = useStyles();

  const CardInfo: React.FC<{
    activeUser: React.ReactNode;
    newUser: React.ReactNode;
  }> = ({ activeUser, newUser }) => (
    <div className={stylesApplications.cardInfo}>
      <div>
        <p>Active User</p>
        <p>{activeUser}</p>
      </div>
      <div>
        <p>New User</p>
        <p>{newUser}</p>
      </div>
    </div>
  );
  return (
    <List<ListItemDataType>
      rowKey="id"
      className={stylesApplications.filterCardList}
      grid={{
        gutter: 24,
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      dataSource={listData}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            hoverable
            bodyStyle={{
              paddingBottom: 20,
            }}
            actions={[
              <Tooltip title="Download" key="download">
                <DownloadOutlined />
              </Tooltip>,
              <Tooltip title="Edit" key="edit">
                <EditOutlined />
              </Tooltip>,
              <Tooltip title="Share" key="share">
                <ShareAltOutlined />
              </Tooltip>,
              <Dropdown
                items={[
                  {
                    key: '1',
                    title: '1st menu item',
                  },
                  {
                    key: '2',
                    title: '2nd menu item',
                  },
                ]}
                key="ellipsis"
              >
                <EllipsisOutlined />
              </Dropdown>,
            ]}
          >
            <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
            <div>
              <CardInfo
                activeUser={formatWan(item.activeUser)}
                newUser={numeral(item.newUser).format('0,0')}
              />
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};
export default Applications;
