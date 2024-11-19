import { Link, useIntl, useModel, useRequest } from '@umijs/max';
import { Card, Col, Form, List, Row, Select, Typography, Button, message, GetProp, UploadProps } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, type FC } from 'react';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import type { IProduct } from './data';
import { queryProducts, createProductPosting as apiCreateProductPosting } from './service';
import useStyles from './style.style';
// import { DefaultOptionType } from 'antd/es/select';
import CreatePostingModalForm from './components/ModalForm';
import FilterMenu from './components/Filter';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

dayjs.extend(relativeTime);

// const categoryOptions: DefaultOptionType[] = Array.from({ length: 5 }).map((_, index) => ({
//   value: `category_${index + 1}`,
//   label: `Category ${index + 1}`,
// }));

const FormItem = Form.Item;
const { Paragraph, Text } = Typography;
const getKey = (id: string, index: number) => `${id}-${index}`;

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

const ProductGrid: FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [modalOpen, setModalOpen] = useState(false);

  const { styles } = useStyles();
  const { data, loading, refresh, run } = useRequest((values: any) => {
    // todo! filter
    console.log('form data', values);
    return queryProducts({
      count: 8,
    });
  });
  const list = data?.data || [];

  const intl = useIntl();

  const cardList = list && (
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
      dataSource={list}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/products/${item._id}`}>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title}
                src={item.image[0]}
              />}
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
  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };

  const { loading: submitting, run: createProductPosting } = useRequest<{
    data: any;
  }>(apiCreateProductPosting, {
    manual: true,
    onSuccess: async (data) => {
      if (data.status === 'success') {
        message.success('Created successfully!');
      }
      else {
        console.error('An error occurred.');
      }
    },
  });

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = async (values: Store) => {
    // console.log(values);
    // todo! fill values with owner id and so on
    // todo! reset on submit

    values.image = await Promise.all(
      values.image.map(
        async (file: any) => {
          if (!file.url && !file.preview) {
            const img = await getBase64(file.originFileObj as FileType);
            return img as string;
          }
          return file.url;
        }
      ));
    console.log(values.image);
    values.creator = currentUser?._id;
    await createProductPosting(values);
  }

  const showModal = () => {
    setModalOpen(true);
  }

  // const handleModalOk = () => {
  //   setModalLoading(true);

  //   // todo!

  //   setModalLoading(false);
  //   setModalOpen(false);
  // }

  const handleModalCancel = () => {
    setModalOpen(false);
  }

  return (
    <>
      <Row gutter={24}>
        <Col span={1}>
        </Col>
        <Col span={4}>
          <FilterMenu />
        </Col>
        <Col span={18}>
          <div className={styles.coverCardList}>
            <Card bordered={false}>
              <Form
                layout="inline"
                onValuesChange={(_, values) => {
                  // 表单项变化时请求数据
                  // 模拟查询表单生效
                  run(values);
                }}
              >
                {/* <StandardFormRow
              title="Categories"
              block
              style={{
                paddingBottom: 11,
              }}
            >
              <FormItem name="category">
                <TagSelect expandable>
                  {categoryOptions.map((category) => (
                    <TagSelect.Option value={category.value!} key={category.value}>
                      {category.label}
                    </TagSelect.Option>
                  ))}
                </TagSelect>
              </FormItem>
            </StandardFormRow> */}
                <StandardFormRow title="Filter" grid last>
                  <Row gutter={16}>
                    <Col lg={8} md={10} sm={10} xs={24}>
                      <FormItem {...formItemLayout} label="Author" name="author">
                        <Select
                          // todo! change to defaultvalue
                          placeholder="Any"
                          style={{
                            maxWidth: 200,
                            width: '100%',
                          }}
                          options={[
                            {
                              label: 'Lisa',
                              value: 'lisa',
                            },
                          ]}
                        />
                      </FormItem>
                    </Col>
                    <Col lg={8} md={10} sm={10} xs={24}>
                      <FormItem {...formItemLayout} label="Rating" name="rate">
                        <Select
                          // todo! change to defaultvalue
                          placeholder="Any"
                          style={{
                            maxWidth: 200,
                            width: '100%',
                          }}
                          options={[
                            {
                              label: 'Good',
                              value: 'good',
                            },
                            {
                              label: 'Normal',
                              value: 'normal',
                            },
                          ]}
                        />
                      </FormItem>
                    </Col>
                    {/* todo! hookup create post action */}
                    <Col lg={8} md={10} sm={10} xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="primary" onClick={showModal} size='large'>Create Posting</Button>
                    </Col>
                  </Row>
                </StandardFormRow>
              </Form>
            </Card>
            <div className={styles.cardList}>{cardList}</div>
          </div>
        </Col>
      </Row>
      {/* modal */}
      <Form.Provider
        onFormFinish={async (name, { values }) => {
          if (name === 'createPostingForm') {
            await onFinish(values);
            refresh();
            setModalOpen(false);
          }
        }}
      >
        <CreatePostingModalForm
          open={modalOpen}
          onOk={(form) => {
            form.submit();
          }}
          onCancel={handleModalCancel}
          loading={submitting}
        />
      </Form.Provider>
    </>
  );
};
export default ProductGrid;
