import { ChatContext } from '@/ChatContext';
import { CloseOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Input, Typography, List, Avatar, Skeleton, FloatButton, Divider } from 'antd';
// import dayjs from 'dayjs';
import React, { createRef, useContext, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { queryChats } from './service';
import { io } from 'socket.io-client';
import { useModel, useRequest } from '@umijs/max';
import dayjs from 'dayjs';

// Replace with backend's URL
const socket = io('http://localhost:3080');
// const socket = io('https://split-n-share-olxp.onrender.com/');

socket.on('message-update', (data) => {
    console.log('DB change detected: ', data);
});

const { Text } = Typography;
const { Search } = Input;

const data = [
    // { text: "Hello, how can I help you?", right: false },
    // { text: "Hi. I live a little far, so I wonder if I could come to your place and pick up instead?", right: true },
    // { text: "Yeah, sure! I live in Areum N19 room 123. Come by whenever!", right: false },
    // { text: "Thanks a lot!", right: true },
]

const users = [
    // { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: true },
    // { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
    // { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
    // { username: 'Jane Doe', text: 'Hello, how can I help you?', date: dayjs(new Date(new Date().getTime() - 1000 * 60 * 60 * 2).getTime()).format('HH:mm'), avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', selected: false },
]

const Widget: React.FC = () => {
    const { chatOpen, setChatOpen } = useContext(ChatContext);
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};

    const [inputValue, setInputValue] = useState('');

    const { data: chatData, loading } = useRequest(() =>
        queryChats()
    );

    //

    const chatToggle = <FloatButton
        // badge={{ count: 5 }}
        tooltip={<div>Chat</div>}
        type="primary"
        icon={<CommentOutlined />}
        onClick={() => { setChatOpen(true) }}
    />

    const handleSend = (value: string) => {
        socket.emit('send message', { value });

        if (chatData.length > 0) {
            chatData[0].messages.push({
                senderId: currentUser?._id,
                text: value,
                timestamp: Date.now(),
            });
        }

        setInputValue('');
    }

    return !chatOpen
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
                            onClick={() => { setChatOpen(false) }}
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
                                    dataLength={chatData.length}
                                    next={() => false}
                                    hasMore={false}
                                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <List
                                        style={{ "marginLeft": "12px", "marginTop": "0px" }}
                                        split={false}
                                        dataSource={chatData}
                                        renderItem={(item: any) => {
                                            const targetUser = item.members.find((member: any) => member._id !== currentUser?._id);
                                            return (
                                                <List.Item>
                                                    {/* todo! <>Jane Doe </>*/}
                                                    <List.Item.Meta
                                                        style={{ backgroundColor: item.selected ? '#f5f5f5' : '#ffffff' }}
                                                        avatar={<Avatar src={targetUser.profile_picture} size="small" />}
                                                        title={
                                                            <>
                                                                {`Trang Nguyen`} &nbsp;<small>{dayjs(item.updatedAt).format('MM/DD HH:mm')}</small>
                                                            </>
                                                        }
                                                        description={item.messages[item.messages.length - 1]?.text || <small>This is the start of a legendary conversation.</small>}
                                                    />
                                                </List.Item>

                                            )
                                        }}
                                    />
                                </InfiniteScroll>
                            </div>
                        </Col>
                        <Col span={16}>
                            <Card title="Trang Nguyen" style={{ width: '100%', height: '91.8%', boxSizing: 'border-box', borderRadius: '0' }} bodyStyle={{ padding: '5px' }}>
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
                                            dataLength={chatData[0].messages.length}
                                            next={() => false}
                                            hasMore={false}
                                            style={{ display: 'flex', flexDirection: 'column-reverse' }}
                                            inverse={true}
                                            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                            // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                            scrollableTarget="scrollableDiv"
                                        >
                                            {

                                                <>
                                                    <List
                                                        split={false}
                                                        dataSource={chatData[0].messages}
                                                        renderItem={(msg: any) => {
                                                            msg.right = currentUser?._id === msg.senderId;
                                                            console.log(chatData[0].messages.length === 0);
                                                            return (
                                                                (
                                                                    <List.Item style={{ float: msg.right ? 'right' : undefined, clear: 'right', padding: '5px', maxWidth: '75%' }}>
                                                                        <Card bodyStyle={{ padding: "12px", backgroundColor: msg.right ? '#f5222d' : '' }}>
                                                                            <Text style={{ color: msg.right ? '#ffffff' : '' }}>{msg.text}</Text>
                                                                        </Card>
                                                                    </List.Item>
                                                                )
                                                            )
                                                        }}
                                                    /><Divider><small style={{color: 'gray'}}>{dayjs(Date.now()).format('MM-DD')}</small></Divider></>}
                                        </InfiniteScroll>
                                    </div>
                                </div>
                            </Card>
                            <Card bordered={false} bodyStyle={{ padding: '0' }}>
                                <Search
                                    // suffix={
                                    //     <Button size='small' onClick={() => { }} type="text" shape="circle" icon={<SendOutlined />} />
                                    // }
                                    key="ChatSearch"
                                    placeholder="Aa"
                                    value={inputValue}
                                    onSearch={handleSend}
                                    style={{ borderRadius: '0 0 10px' }}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    enterButton={
                                        <Button size='small' onClick={() => { }} type="text" shape="circle" icon={<SendOutlined />} />
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