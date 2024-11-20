import { ClusterOutlined, ContactsOutlined, HomeOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { useParams, useRequest } from '@umijs/max';
import { Button, Card, Col, Divider, Form, GetProps, Input, message, Modal, Rate, Row, Tag } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import useStyles from './Center.style';
import Articles from './components/Articles';
import Projects from './components/Projects';
import Cobuyers from './components/Cobuyers';
import type { CurrentUser, tabKeyType } from './data.d';
import { queryCurrentUser, queryUser, queryReviews, createReview as apiCreateReview } from './service';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';

const operationTabList = [
  {
    key: 'received_reviews',
    tab: (
      <span>
        Received Reviews{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
  {
    key: 'given_reviews',
    tab: (
      <span>
        Given Reviews{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
  {
    key: 'postings',
    tab: (
      <span>
        Your Postings{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
];
// const TagList: React.FC<{
//   tags: CurrentUser['tags'];
// }> = ({ tags }) => {
//   const { styles } = useStyles();
//   const ref = useRef<InputRef | null>(null);
//   const [newTags, setNewTags] = useState<TagType[]>([]);
//   const [inputVisible, setInputVisible] = useState<boolean>(false);
//   const [inputValue, setInputValue] = useState<string>('');
//   const showInput = () => {
//     setInputVisible(true);
//     if (ref.current) {
//       // eslint-disable-next-line no-unused-expressions
//       ref.current?.focus();
//     }
//   };
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value);
//   };
//   const handleInputConfirm = () => {
//     let tempsTags = [...newTags];
//     if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
//       tempsTags = [
//         ...tempsTags,
//         {
//           key: `new-${tempsTags.length}`,
//           label: inputValue,
//         },
//       ];
//     }
//     setNewTags(tempsTags);
//     setInputVisible(false);
//     setInputValue('');
//   };
//   return (
//     <div className={styles.tags}>
//       <div className={styles.tagsTitle}>Tags</div>
//       {(tags || []).concat(newTags).map((item) => (
//         <Tag key={item.key}>{item.label}</Tag>
//       ))}
//       {inputVisible && (
//         <Input
//           ref={ref}
//           type="text"
//           size="small"
//           style={{
//             width: 78,
//           }}
//           value={inputValue}
//           onChange={handleInputChange}
//           onBlur={handleInputConfirm}
//           onPressEnter={handleInputConfirm}
//         />
//       )}
//       {!inputVisible && (
//         <Tag
//           onClick={showInput}
//           style={{
//             borderStyle: 'dashed',
//           }}
//         >
//           <PlusOutlined />
//         </Tag>
//       )}
//     </div>
//   );
// };

type ModalProps = GetProps<typeof Modal> & {
  open: boolean;
  onOk: (form: any) => void;
};

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

// type FormInstance = GetRef<typeof Form>;

// const useResetFormOnCloseModal = ({ form, open }: { form: FormInstance; open: boolean }) => {
//   const prevOpenRef = useRef<boolean>();
//   useEffect(() => {
//     prevOpenRef.current = open;
//   }, [open]);
//   const prevOpen = prevOpenRef.current;

//   useEffect(() => {
//     if (!open && prevOpen) {
//       form.resetFields();
//     }
//   }, [form, prevOpen, open]);
// };

const WriteReviewModalForm: FC<ModalProps> = ({ open, onOk: handleOk, onCancel, loading }) => {
  const [form] = Form.useForm();

  const onOk = () => {
    handleOk(form);
  }

  // uncomment if resetting form on modal close is desired

  // useResetFormOnCloseModal({
  //   form,
  //   open,
  // });

  return (
    <Modal
      width={800}
      open={open}
      title="Write Review"
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>
          Submit
        </Button>,
      ]}
    >
      <Divider />
      <Form form={form} layout="vertical" name="writeReviewForm">
        <Form.Item name="review" label="Write your review" rules={[{ required: true, message: 'Please note your experience.' }]}>
          <Input.TextArea
            autoSize={{ minRows: 6, maxRows: 12 }}
            placeholder='Write about your experience.' />
        </Form.Item>

        <Form.Item name="rating" label={<><Tag color="warning">optional</Tag> Rate your experience</>}>
          <Rate />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const Center: React.FC = () => {
  const { userId } = useParams();
  const { styles } = useStyles();

  const token = localStorage.getItem('token')?.split(" ")[1];

  const decoded = token !== undefined ? jwt.decode(token) as any : { id: undefined };
  const currentUserId = decoded.id;

  const [tabKey, setTabKey] = useState<tabKeyType>('received_reviews');
  const [modalOpen, setModalOpen] = useState(false);

  const { loading: submitting, run: createReview } = useRequest<{
    data: any;
  }>(apiCreateReview, {
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

  const onFinish = (values: Store) => {
    // console.log(values);
    // todo! fill values with owner id and so on
    // todo! reset on submit
    createReview(values);
  }

  const showModal = () => {
    setModalOpen(true);
  }

  const handleModalCancel = () => {
    setModalOpen(false);
  }


  //  获取用户信息
  const { data, loading } = useRequest(() => {
    if (userId === undefined) {
      return queryCurrentUser();
    } else {
      return queryUser({ id: userId });
    }
  });

  const currentUser = data?.data;

  // 获取tab列表数据
  const { data: receivedReviews, loading: loadingReceived, run: runReceived } = useRequest(() => {
    if (currentUser === undefined) { return; }
    return queryReviews({
      target: currentUser._id
    });
  });

  const { data: givenReviews, loading: loadingGiven, run: runGiven } = useRequest(() => {
    if (currentUser === undefined) { return; }
    return queryReviews({
      author: currentUser._id
    });
  });

  // 获取tab列表数据
  const { data: receivedReviewAuthors, run: runReceivedReviewAuthors } = useRequest(() => {
    if (receivedReviews === undefined) { return; }
    if (receivedReviews.data.length === 0) { return; }
    return queryUser({
      id: '[' + receivedReviews.data.map((item) => item.author).join(',') + ']'
    });
  });

  const { data: givenReviewTargets, run: runGivenReviewTargets } = useRequest(() => {
    if (givenReviews === undefined) { return; }
    if (givenReviews.data.length === 0) { return; }
    return queryUser({
      id: '[' + givenReviews.data.map((item) => item.target).join(',') + ']'
    });
  });

  useEffect(() => {
    runReceived();
    runGiven();
  }, [loading]);

  useEffect(() => {
    runReceivedReviewAuthors();
  }, [loadingReceived]);

  useEffect(() => {
    runGivenReviewTargets();
  }, [loadingGiven]);

  //  渲染用户信息
  const renderUserInfo = ({ join_date, dorm, department }: Partial<CurrentUser>) => {
    console.log("Joined", join_date);
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined
            style={{
              marginRight: 8,
            }}
          />
          {"Joined "}

          <span>{dayjs(join_date).fromNow()}</span>

        </p>
        <p>
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {department}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {dorm}
        </p>
      </div>
    );
  };

  // 渲染tab切换
  const renderChildrenByTabKey = (tabValue: tabKeyType) => {
    if (tabValue === 'postings') {
      // todo!
      // return <Projects data={data} />;
      return <Projects data={[]} />;
    }

    if (tabValue === 'given_reviews') {
      console.log('Given  -----');
      console.log(givenReviews);
      return <Articles key="given_reviews" tab="given" data={givenReviews?.data || []} targetUsers={givenReviewTargets?.data || []} />;
    }
    if (tabValue === 'received_reviews') {
      console.log('Received  -----');
      console.log(receivedReviews);
      return <Articles key="received_reviews" tab="received" data={receivedReviews?.data || []} targetUsers={receivedReviewAuthors?.data || []} />;
    }
    return null;
  };

  return (
    <>
      <GridContent>
        <Row gutter={24}>
          <Col lg={6} md={24}>

            <Card
              bordered={false}
              style={{
                marginBottom: 24,
              }}
              loading={loading}
            >
              {!loading && currentUser && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.profile_picture} />
                    <div className={styles.name}>{`${currentUser.first_name} ${currentUser.last_name}`}</div>
                    <div>{currentUser?.desc}</div>
                  </div>
                  {renderUserInfo(currentUser)}
                  {/* <Divider dashed /> */}
                  {/* <TagList tags={currentUser.tags || []} /> */}
                  <Divider
                    style={{
                      marginTop: 16,
                    }}
                    dashed
                  />
                  {/* <div className={styles.team}>
                    <div className={styles.teamTitle}>Organizations</div>
                    <Row gutter={36}>
                      {currentUser.notice &&
                        currentUser.notice.map((item) => (
                          <Col key={item.id} lg={24} xl={12}>
                            <a href={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </a>
                          </Col>
                        ))}
                    </Row>
                  </div> */}
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            {(!userId || (currentUserId === userId)) && <Card title="Your Past Cobuyers">
              {/* <Cobuyers data={(listData?.list || [])} /> */}
              <Cobuyers data={([])} />
            </Card>}
            <br />
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={(_tabKey: string) => {
                setTabKey(_tabKey as tabKeyType);
              }}
              tabBarExtraContent={
                userId && (currentUserId !== userId) && <Button type='primary' size='large' onClick={showModal}>Write a review</Button>
              }
            >
              {renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
      <Form.Provider
        onFormFinish={(name, { values }) => {
          if (name === 'writeReviewForm') {
            onFinish(values);
            setModalOpen(false);
          }
        }}
      >
        <WriteReviewModalForm
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
export default Center;
