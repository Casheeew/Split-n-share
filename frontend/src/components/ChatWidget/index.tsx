import { ChatContext } from '@/ChatContext';
import { CloseOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Input, Typography, List, Avatar, Skeleton, FloatButton, Divider } from 'antd';
// import dayjs from 'dayjs';
import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { queryChats } from './service';
import { io } from 'socket.io-client';
import { useModel, useRequest } from '@umijs/max';
import dayjs from 'dayjs';

import './styles.css';
import AvatarList from '@/pages/browse/products/components/AvatarList';

// Replace with backend's URL
// const socket = io('http://localhost:3080');
const socket = io('https://split-n-share-olxp.onrender.com/');

// socket.on('message-update', (data) => {
//     console.log('DB change detected: ', data);
// });

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
    const { chatOpen, setChatOpen, selectedChatId, setSelectedChatId } = useContext(ChatContext);
    const { initialState } = useModel('@@initialState');
    const { currentUser } = initialState || {};

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [selectedChatMessages, setSelectedChatMessages] = useState<any>([]);

    const [targetName, setTargetName] = useState<any>(undefined);

    const [inputValue, setInputValue] = useState('');

    const { data: chatData, loading, run } = useRequest(() => queryChats(), {
        onSuccess: (data) => {
            const found = data.find((x: any) => x._id === selectedChatId);
            console.log(selectedChatId);
            console.log(found);
            const selected = found ? found : data[0];
            const targetUser = selected.members.find((member: any) => member._id !== currentUser?._id);
            const name = targetUser ? `${targetUser.first_name} ${targetUser.last_name}` : 'Chat'; 
            if (data.length > 0) {
                setSelectedChatId(selected._id);
                setSelectedChatMessages(selected.messages || []);
                setTargetName(selected.productId ? selected.productId.title : name);
            }
        }
    });

    useEffect(() => {
        run();
    }, [chatOpen]);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        function onChatEvent() {
            run();
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('chat message', onChatEvent);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('chat message', onChatEvent);
        };
    }, []);

    const chatToggle = <FloatButton
        // badge={{ count: 5 }}
        tooltip={<div>Chat</div>}
        type="primary"
        icon={<CommentOutlined />}
        onClick={() => { setChatOpen(true) }}
    />

    const handleSend = (value: string) => {
        socket.emit('send message', {
            chatId: selectedChatId,
            senderId: currentUser?._id,
            text: value,
        });
        setInputValue('');
    }

    const handleChatNavClick = (chatId: string, name: any) =>
        () => {
            setSelectedChatId(chatId);
            setSelectedChatMessages(chatData?.find((chat: any) => chat._id === chatId)?.messages || []);
            setTargetName(name);
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
                                    dataLength={chatData?.length || 0}
                                    next={() => false}
                                    hasMore={false}
                                    loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                    scrollableTarget="scrollableDiv"
                                >
                                    <List
                                        style={{ "marginTop": "0px" }}
                                        dataSource={chatData}
                                        renderItem={(item: any) => {
                                            const two = !item.productId;
                                            const targetUser = item.members.find((member: any) => member._id !== currentUser?._id);
                                            console.log(item.members);
                                            if (!targetUser) { return <></> }
                                            return (
                                                <List.Item
                                                    onClick={handleChatNavClick(item._id, two ? `${targetUser.first_name} ${targetUser.last_name}` : item.productId.title)}
                                                    style={{ backgroundColor: selectedChatId === item._id ? '#f5f5f5' : '' }}
                                                    className='chat-nav'>
                                                    {/* todo! <>Jane Doe </>*/}
                                                    <List.Item.Meta
                                                        style={{ marginLeft: '12px', backgroundColor: selectedChatId === item._id ? '#f5f5f5' : '' }}
                                                        className='chat-nav'
                                                        avatar={
                                                            two ? <Avatar src={targetUser.profile_picture} size="small" />
                                                                : <Avatar src={item.productId.image[0]} />}
                                                        title={
                                                            <>
                                                                {two ? `${targetUser.first_name} ${targetUser.last_name}` : item.productId.title} &nbsp;<small>{dayjs(item.updatedAt).format('MM/DD HH:mm')}</small>
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
                            <Card title={targetName !== undefined ? `${targetName}` : "Chat"} style={{ width: '100%', height: '91.8%', boxSizing: 'border-box', borderRadius: '0' }} bodyStyle={{ padding: '5px' }}>
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
                                            dataLength={
                                                selectedChatMessages.length
                                            }
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
                                                        dataSource={selectedChatMessages}
                                                        renderItem={(msg: any) => {
                                                            msg.right = currentUser?._id === msg.senderId._id;
                                                            return (
                                                                (
                                                                    <List.Item style={{ float: msg.right ? 'right' : undefined, clear: 'right', padding: '5px', maxWidth: '75%' }}>
                                                                        <div>
                                                                            <small>{`${msg.senderId.first_name} ${msg.senderId.last_name}`}</small>
                                                                            <Card bodyStyle={{ padding: "12px", backgroundColor: msg.right ? '#f5222d' : '' }}>
                                                                                <Text style={{ color: msg.right ? '#ffffff' : '' }}>{msg.text}</Text>
                                                                            </Card>
                                                                        </div>
                                                                    </List.Item>
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    <Divider><small style={{ color: 'gray' }}>{dayjs((selectedChatMessages.length > 0 ? selectedChatMessages[0].timestamp : Date.now())).format('MM-DD')}</small></Divider>
                                                </>}
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
                                    disabled={selectedChatId === '' || chatData === undefined}
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