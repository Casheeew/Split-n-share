import { Link, useIntl, useModel, useRequest } from '@umijs/max';
import { Button, Divider, Form, Image, Input, message, Popover, Progress } from 'antd';
import type { Store } from 'antd/es/form/interface';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { UserData } from './service';
import { fakeRegister } from './service';
import useStyles from './style.style';
import { flushSync } from 'react-dom';

const FormItem = Form.Item;

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const Register: FC = () => {
  const { styles } = useStyles();
  const intl = useIntl();
  // const [count, setCount]: [number, any] = useState(0);
  const [open, setVisible]: [boolean, any] = useState(false);
  // const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const confirmDirty = false;
  let interval: number | undefined;

  const passwordStatusMap = {
    ok: (
      <div className={styles.success}>
        <span>Strong Password</span>
      </div>
    ),
    pass: (
      <div className={styles.warning}>
        <span>Medium Password</span>
      </div>
    ),
    poor: (
      <div className={styles.error}>
        <span>Weak Password</span>
      </div>
    ),
  };

  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );
  // const onGetCaptcha = () => {
  //   let counts = 59;
  //   setCount(counts);
  //   interval = window.setInterval(() => {
  //     counts -= 1;
  //     setCount(counts);
  //     if (counts === 0) {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // };
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const { loading: submitting, run: register } = useRequest<{
    data: UserData;
  }>(fakeRegister, {
    manual: true,
    onSuccess: async (data) => {
      if (data.status === 'success') {
        message.success('Registered successfully!');

        localStorage.setItem("username", data.name);
        localStorage.setItem("token", 'Bearer ' + data.token);

        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
      }
      else {
        console.error('register unsuccessful')
      }
    },
  });
  const onFinish = (values: Store) => {
    delete values.confirm;
    register(values);
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('Passwords do not match.');
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject('Please enter your password.');
    }
    // 有值的情况
    if (!open) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  // const changePrefix = (value: string) => {
  //   setPrefix(value);
  // };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              lineHeight: '44px',
            }}>
              <Image
                style={{ verticalAlign: 'top' }}
                width={44}
                src={'/split-n-share-logo.jpg'}
              />
              <span style={{
                marginInlineStart: '16px',
                position: 'relative',
                insetBlockStart: '2px',
                fontWeight: 600,
                fontSize: '33px',
              }}>
                Split-n-Share!
              </span>
            </div>
            <div style={{
              marginBlockStart: '12px',
              marginBlockEnd: '40px',
              color: 'rgba(0, 0, 0, 0.65)',
              fontSize: '14px',
            }}>
              {intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
            </div>
          </div>
          <div className={styles.main}>
            <Divider>Sign Up</Divider>
            <Form form={form} name="UserRegister" onFinish={onFinish}>
              {/* <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: 'Please enter your email.',
            },
            {
              type: 'email',
              message: 'Please enter a valid email.',
            },
          ]}
        >
          <Input size="large" placeholder="email" />
        </FormItem> */}
              <FormItem
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your KAIST email.',
                  },
                ]}
              >
                <Input size="large" placeholder="KAIST email" />
              </FormItem>
              <FormItem
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your first name.',
                  },
                ]}
              >
                <Input size="large" placeholder="First Name" />
              </FormItem>
              <FormItem
                name="last_name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your last name.',
                  },
                ]}
              >
                <Input size="large" placeholder="Last Name" />
              </FormItem>
              <Popover
                getPopupContainer={(node) => {
                  if (node && node.parentNode) {
                    return node.parentNode as HTMLElement;
                  }
                  return node;
                }}
                content={
                  open && (
                    <div
                      style={{
                        padding: '4px 0',
                      }}
                    >
                      {passwordStatusMap[getPasswordStatus()]}
                      {renderPasswordProgress()}
                      <div
                        style={{
                          marginTop: 10,
                        }}
                      >
                        <span>Please type at least 6 characters, lowercase and uppercase. Try to make a strong password.</span>
                      </div>
                    </div>
                  )
                }
                overlayStyle={{
                  width: 240,
                }}
                placement="right"
                open={open}
              >
                <FormItem
                  name="password"
                  className={
                    form.getFieldValue('password') &&
                    form.getFieldValue('password').length > 0 &&
                    styles.password
                  }
                  rules={[
                    {
                      validator: checkPassword,
                    },
                  ]}
                >
                  <Input size="large" type="password" placeholder="Password" />
                </FormItem>
              </Popover>
              <FormItem
                name="confirm"
                rules={[
                  {
                    required: true,
                    message: 'Password required',
                  },
                  {
                    validator: checkConfirm,
                  },
                ]}
              >
                <Input size="large" type="password" placeholder="Confirm" />
              </FormItem>
              <FormItem>
                <div className={styles.footer}>
                  <Button
                    size="large"
                    loading={submitting}
                    className={styles.submit}
                    type="primary"
                    htmlType="submit"
                  >
                    <span>Register</span>
                  </Button>
                  <Link to="/user/login">
                    <span>Already have an account?</span>
                  </Link>
                </div>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
