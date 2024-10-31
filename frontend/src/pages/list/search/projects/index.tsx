import { useRequest } from '@umijs/max';
import { Card, Col, Form, List, Row, Select, Typography, Button } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { categoryOptions } from '../../mock';
import AvatarList from './components/AvatarList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import type { ListItemDataType } from './data.d';
import { queryFakeList } from './service';
import useStyles from './style.style';

dayjs.extend(relativeTime);

const FormItem = Form.Item;
const { Paragraph } = Typography;
const getKey = (id: string, index: number) => `${id}-${index}`;
const Projects: FC = () => {
  const { styles } = useStyles();
  const { data, loading, run } = useRequest((values: any) => {
    // todo! filter
    console.log('form data', values);
    return queryFakeList({
      count: 8,
    });
  });
  const list = data?.list || [];
  const cardList = list && (
    <List<ListItemDataType>
      rowKey="id"
      loading={loading}
      grid={{
        gutter: 16,
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
          <Card className={styles.card} hoverable cover={<img alt={item.title} src={item.cover} />}>
            <Card.Meta
              title={<a>{item.title}</a>}
              description={
                <Paragraph
                  ellipsis={{
                    rows: 2,
                  }}
                >
                  {item.subDescription}
                </Paragraph>
              }
            />
            <div className={styles.cardItemContent}>
              <span>{dayjs(item.updatedAt).fromNow()}</span>
              <div className={styles.avatarList}>
                <AvatarList size="small">
                  {item.members.map((member, i) => (
                    <AvatarList.Item
                      key={getKey(item.id, i)}
                      src={member.avatar}
                      tips={member.name}
                    />
                    ))}
                </AvatarList>
              </div>
            </div>
          </Card>
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
  return (
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
          <StandardFormRow
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
          </StandardFormRow>
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
              <Col lg={8} md={10} sm={10} xs={24} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button type="primary" size='large'>Create Posting</Button>
              </Col>
            </Row>
          </StandardFormRow>
        </Form>
      </Card>
      <div className={styles.cardList}>{cardList}</div>
    </div>
  );
};
export default Projects;
