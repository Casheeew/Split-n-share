import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Input, message, Upload } from 'antd';
import React from 'react';
import { queryCity, currentUser as queryCurrentUser, queryProvince } from '../service';
import useStyles from './index.style';

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>Profile Picture</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            Upload image
          </Button>
        </div>
      </Upload>
    </>
  );
  const { data: currentUserData, loading } = useRequest(() => {
    return queryCurrentUser();
  });

  const currentUser = currentUserData?.data;

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.profile_picture) {
        return currentUser.profile_picture;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };
  const handleFinish = async () => {
    message.success('Updated user settings!');
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: 'Update Settings',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone?.split('-'),
              }}
              hideRequiredMark
            >
              {/* <ProFormText
                width="lg"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              /> */}
              {/* <ProFormText
                width="lg"
                name="name"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              /> */}
              <ProFormTextArea
                name="profile"
                label="About Me"
                // rules={[
                //   {
                //     required: true,
                //     message: '请输入个人简介!',
                //   },
                // ]}
                placeholder="Write something about yourself."
              />
              <ProFormSelect
                width="sm"
                name="dorm"
                label="Dormitory"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the dormitory you are living in!',
                  },
                ]}
                options={[
                  {
                    value: 'areumgwan',
                    label: 'N19 - Areum Hall',
                  },
                  {
                    value: 'somanggwan',
                    label: 'N16 - Somang Hall',
                  },
                  {
                    value: 'saranggwan',
                    label: 'N14 - Sarang Hall',
                  },
                  {
                    value: 'heemanggwan',
                    label: 'W4-4 Heemang Hall',
                  },
                  {
                    value: 'outside',
                    label: 'Outside',
                  },
                ]}
              />
  
              {/* <ProFormText
                width="md"
                name="address"
                label="街道地址"
                rules={[
                  {
                    required: true,
                    message: '请输入您的街道地址!',
                  },
                ]}
              /> */}
              <ProFormFieldSet
                name="phone"
                label="(Optional) Phone Number"
                rules={[
                  {
                    validator: validatorPhone,
                  },
                ]}
              >
                <Input className={styles.area_code} defaultValue={'010'} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};
export default BaseView;
