import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#F5222D',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Split-n-Share',
  pwa: true,
  logo: 'frontend/public/split-n-share-logo.jpg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    header: {
      colorHeaderTitle: "rgba(255,255,255,1)",
      colorTextMenuSelected: "rgba(255,255,255,1)",
      colorTextMenu: "rgba(255,255,255,1)",
      colorTextRightActionsItem: "rgba(255,255,255,1)",
      colorBgRightActionsItemHover: "rgba(255,255,255,0.15)",
      colorTextMenuSecondary: "rgba(255,255,255,1)",
      colorTextMenuActive: "rgba(255,255,255,0.75)",
      colorBgHeader: "#D0011B",

    }
  },
};

export default Settings;
