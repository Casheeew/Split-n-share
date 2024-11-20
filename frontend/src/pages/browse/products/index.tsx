import { Link, useIntl, useModel, useRequest } from '@umijs/max';
import { Card, Col, Form, List, Row, Select, Typography, Button, message, GetProp, UploadProps } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect, type FC } from 'react';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import type { IProduct } from './data';
import { queryProducts, createProductPosting as apiCreateProductPosting } from './service';
import useStyles from './style.style';
import CreatePostingModalForm from './components/ModalForm';
import FilterMenu from './components/Filter';

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const { Paragraph, Text } = Typography;
const getKey = (id: string, index: number) => `${id}-${index}`;

const ProductGrid: FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]); 
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 

  const { styles } = useStyles();
  const intl = useIntl();

  const { loading, run } = useRequest(() => queryProducts({ count: 50 }), {
    manual: true, 
    onSuccess: (data) => {
      setAllProducts(data?.data || []);
      setFilteredProducts(data?.data || []); 
    },
  });

  useEffect(() => {
    run(); 
  }, []);

  const handleCategoryChange = (key: string) => {
    const category = key === 'all_categories' ? '' : key;
    setSelectedCategory(category);

    const searchParams = new URLSearchParams(window.location.search);
    if (category) {
      searchParams.set('categories', category); 
    } else {
      searchParams.delete('categories'); 
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);

    if (category) {
      setFilteredProducts(
        allProducts.filter((product) => product.category === category)
      );
    } else {
      setFilteredProducts(allProducts);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get('categories') || '';
    setSelectedCategory(category);

    if (category) {
      setFilteredProducts(
        allProducts.filter((product) => product.category === category)
      );
    } else {
      setFilteredProducts(allProducts);
    }
  }, [window.location.search, allProducts]);

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const onFinish = async (values: any) => {
    values.image = await Promise.all(
      values.image.map(async (file: any) => {
        if (!file.url && !file.preview) {
          const img = await getBase64(file.originFileObj as FileType);
          return img as string;
        }
        return file.url;
      })
    );
    values.creator = currentUser?._id;

    const result = await apiCreateProductPosting(values);
    if (result?.status === 'success') {
      message.success('Created successfully!');
      run(); 
      setModalOpen(false);
    } else {
      message.error('An error occurred.');
    }
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const cardList = filteredProducts.length > 0 ? (
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
      dataSource={filteredProducts}
      renderItem={(item) => (
        <List.Item>
          <Link to={`/products/${item._id}`}>
            <Card
              className={styles.card}
              hoverable
              cover={ 
                <div style={{ overflow: 'hidden', width: '100%', height: '170px' }}>
                  <img alt={item.title} style={{ width: '100%' }} src={item.image[0]} />
                </div>
              }
            >
              <Card.Meta
                title={<a>{item.title}</a>}
                description={
                  <>
                    <Text style={{ color: 'rgba(208, 1, 27, 1)' }}>
                      <b>{`${intl.formatNumber(item.price)} KRW`}</b>
                    </Text>
                    <Paragraph ellipsis={{ rows: 2 }}>
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
                        src={member.avatar}
                        tips={member.name}
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
  ) : (
    <div>No data</div>
  );

  return (
    <>
      <Row gutter={24}>
        <Col span={1}></Col>
        <Col span={4}>
          <FilterMenu onClick={({ key }) => handleCategoryChange(key)} /> {/* Handle category filter */}
        </Col>
        <Col span={18}>
          <div className={styles.coverCardList}>
            <Card bordered={false}>
              <Form
                layout="inline"
                onValuesChange={(_, values) => {
                  // Optional: Add additional filters here
                }}
              >
                <StandardFormRow title="Filter" grid last>
                  <Row gutter={16}>
                    <Col lg={8} md={10} sm={10} xs={24}>
                      <FormItem label="Dormitory" name="dorm">
                        <Select
                          placeholder="Any"
                          style={{
                            maxWidth: 200,
                            width: '100%',
                          }}
                          options={[
                            { value: 'sejonggwan', label: 'E8 - Sejong Hall' },
                            { value: 'jihyegwan', label: 'N21 - Jihye Hall' },
                            { value: 'silloegwan', label: 'N20 - Silloe Hall' },
                            { value: 'areumgwan', label: 'N19 - Areum Hall' },
                            { value: 'jilligwan', label: 'N18 - Jilli Hall' },
                            { value: 'seongsilgwan', label: 'N17 - Seongsil Hall' },
                            { value: 'somanggwan', label: 'N16 - Somang Hall' },
                            { value: 'saranggwan', label: 'N14 - Sarang Hall' },
                            { value: 'mirgwan', label: 'W6 - Mir Hall' },
                            { value: 'naraegwan', label: 'W6 - Narae Hall' },
                            { value: 'yejigwan', label: 'W5 - Yeji Hall' },
                            { value: 'heemanggwan', label: 'W4-4 - Heemang Hall' },
                            { value: 'dasomgwan', label: 'W4-3 - Dasom Hall' },
                            { value: 'nadlgwan', label: 'W4-2 - Nadl Hall' },
                            { value: 'yeoulgwan', label: 'W4-1 - Yeoul Hall' },
                            { value: 'other', label: 'Outside of Main Campus' },
                          ]}
                        />
                      </FormItem>
                    </Col>
                    
                    <Col lg={8} md={10} sm={10} xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button type="primary" onClick={showModal} size="large">
                        Create Posting
                      </Button>
                    </Col>
                  </Row>
                </StandardFormRow>
              </Form>
            </Card>
            <div className={styles.cardList}>{cardList}</div>
          </div>
        </Col>
      </Row>
      <Form.Provider
        onFormFinish={async (name, { values }) => {
          if (name === 'createPostingForm') {
            await onFinish(values);
            run(); 
          }
        }}
      >
        <CreatePostingModalForm
          open={modalOpen}
          onOk={(form) => form.submit()}
          onCancel={() => setModalOpen(false)}
          loading={loading}
        />
      </Form.Provider>
    </>
  );
};

export default ProductGrid;