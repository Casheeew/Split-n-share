import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'all_categories',
    label: 'All Categories',
    type: 'group',
    children: [
      { key: 'food_drink', label: 'Food & Drink' },
      { key: 'health_beauty', label: 'Health & Beauty' },
      { key: 'electronics', label: 'Electronics' },
      { key: 'home_kitchen', label: 'Home & Kitchen' },
      { key: 'outdoors', label: 'Outdoors' },
    ],
  },
];

const FilterMenu: React.FC = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    // todo! hookup filtering logic
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

export default FilterMenu;