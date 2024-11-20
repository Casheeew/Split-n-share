import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'all_categories',
    label: 'Categories',
    type: 'group',
    children: [
      { key: 'all', label: 'All Categories' },
      { key: 'food_drink', label: 'Food & Drink' },
      { key: 'health_beauty', label: 'Health & Beauty' },
      { key: 'electronics', label: 'Electronics' },
      { key: 'home_kitchen', label: 'Home & Kitchen' },
      { key: 'outdoors', label: 'Outdoors' },
    ],
  },
];

type FilterMenuProps = {
  onClick: MenuProps['onClick'];
}

const FilterMenu: React.FC<FilterMenuProps> = ({onClick}) => {

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