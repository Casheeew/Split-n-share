import { CloseOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Input, Typography, List, Avatar, Skeleton, Divider, FloatButton } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Text } = Typography;
const { Search } = Input;

const data = [
    { text: "Hello, how can I help you?", right: false },
    { text: "Hi. I live a little far, so I wonder if I could come to your place and pick up instead?", right: true },
    { text: "Yeah, sure! I live in Areum N19 room 123. Come by whenever!", right: false },
    { text: "Thanks a lot!", right: true },
]

const users = [
    { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: true },
    { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
    { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
    { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
]

const Widget: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    const chatToggle = <FloatButton
        badge={{ count: 5 }}
        tooltip={<div>Chat</div>}
        type="primary"
        icon={<CommentOutlined />}
        onClick={() => { setOpen(true) }}
    />

    return !open
        ? chatToggle
        : (
            <div className="rcw-widget-container">
                <Card
                    bodyStyle={{
                        "padding": "0px",
                    }}
                    title="Chat"
                    className="rcw-conversation-container"
                    extra={
                        <Button
                            size='small'
                            type="text"
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={() => { setOpen(false) }}
                        />
                    }
                >

                    <Row style={{ "height": "100%", "minHeight": "400px", "maxHeight": "400px" }}>
                        <Col span={8} style={{ "height": "100%" }}>
                            <Search style={{ borderRadius: '0' }} key="ChatSearch" onSearch={(value) => {
                                console.log(value);
                                // todo! search
                                // todo! change icon
                            }} placeholder="Search for chats"
                            />
                            <div
                                id="scrollableDiv"
                                style={{
                                    height: 368,
                                    overflow: 'auto',
                                }}
                            >
                                <InfiniteScroll
                                    dataLength={data.length}
                                    next={() => false}
                                    hasMore={data.length < 50}
                                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                    endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <List
                                        style={{ "marginLeft": "12px", "marginTop": "0px" }}
                                        split={false}
                                        dataSource={users}
                                        renderItem={(item) => (
                                            <List.Item>
                                                {/* todo! <>Jane Doe </>*/}
                                                <List.Item.Meta
                                                    style={{backgroundColor: item.selected ? '#f5f5f5' : '#ffffff' }}
                                                    avatar={<Avatar src={item.avatar} size="small" />}
                                                    title={<>{item.username} &nbsp;<small>{item.date}</small></>}
                                                    description={item.text}
                                                />
                                            </List.Item>

                                        )}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                        <Col span={16}>
                            <Card title="Jane Doe" style={{ width: '100%', height: '91.8%', boxSizing: 'border-box', borderRadius: '0' }} bodyStyle={{ padding: '5px' }}>
                                <div style={{
                                    height: '100%', width: '100%', overflow: 'auto',
                                }}>
                                    <div
                                        id="scrollableDiv"
                                        style={{
                                            height: 300,
                                            overflow: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column-reverse',
                                        }}
                                    >
                                        <InfiniteScroll
                                            dataLength={data.length}
                                            next={() => false}
                                            hasMore={data.length < 50}
                                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                            inverse={true}
                                            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                            scrollableTarget="scrollableDiv"
                                        >
                                            <List
                                                split={false}
                                                dataSource={data}
                                                renderItem={(item) => (
                                                    <List.Item style={{ float: item.right ? 'right' : undefined, clear: 'right', padding: '5px', maxWidth: '75%' }}>
                                                        <Card bodyStyle={{ padding: "12px", backgroundColor: item.right ? '#f5222d' : '' }}>
                                                            <Text style={{ color: item.right ? '#ffffff' : '' }}>{item.text}</Text>
                                                        </Card>
                                                    </List.Item>
                                                )}
                                            />
                                        </InfiniteScroll>
                                    </div>
                                </div>
                            </Card>
                            <Card bordered={false} bodyStyle={{ padding: '0' }}>
                                <Input
                                    key="ChatSearch"
                                    placeholder="Aa"
                                    style={{ borderRadius: '0 0 10px' }}
                                    suffix={
                                        <Button size='small' type="text" shape="circle" icon={<SendOutlined />} />
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </div >
        )
}

export default Widget;