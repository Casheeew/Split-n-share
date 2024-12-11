import { QuestionCircleOutlined, BellOutlined, InfoCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { history, SelectLang as UmiSelectLang } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import { Tooltip } from 'antd';

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return <UmiSelectLang />;
};

export const Postings = () => {
  return (
    <Tooltip title="My Postings">
      <AppstoreOutlined onClick={() => {
        history.push(`/postings`);
      }} />
    </Tooltip>
  );
}

export const Notification = () => {
  // todo! open notifications
  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: () => { },
        items: [{
          key: 'info',
          icon: <InfoCircleOutlined />,
          label: 'No notifications.',
          disabled: true,
        },],
      }}
    >
      <div
        style={{
          display: 'flex',
          height: 26,
        }}
      >
        <BellOutlined />
      </div>
    </HeaderDropdown>
  );
};
export const Question = () => {
  // todo! link to help page
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};
