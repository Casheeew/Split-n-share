import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="2024 Tiramisu"
      links={[
        {
          key: 'Tiramisu',
          title: <>2024 Team Tiramisu <GithubOutlined /></>,
          href: 'https://github.com/Casheeew/split-n-share',
          blankTarget: true,
        },
        {
          key: 'CS473',
          title: 'CS473 Social Computing',
          href: 'https://social.cstlab.org/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
