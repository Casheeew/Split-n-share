import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';
import app from './app';
import User from './models/user';
import Review from './models/review';
import GroupChat from './models/groupchat';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Product from './models/product';

const dbConnString = process.env.DB_CONN_STRING;

async function sendMessage(chatId: string, userId: mongoose.Types.ObjectId, text: string) {
    const groupChat = await GroupChat.findById(chatId);
    if (!groupChat) {
        return;
    }

    // Check if the user is a member of the group chat
    //   if (!groupChat.members.some((member) => member.toString() === userId.toString())) {
    //     return res.status(403).json({ error: "You are not a member of this group chat" });
    //   }
    //   console.log(groupChat.members);
    //   console.log(userId);
    // Add the message to the group's messages
    groupChat.messages.push({
        senderId: userId,
        text,
        timestamp: new Date(),
    });

    await groupChat.save();
}

async function main() {
    const clientOptions: ConnectOptions = {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
        // todo!
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    };
    if (dbConnString === undefined) {
        throw new Error('DB_CONN_STRING missing from environment.');
    }

    // Connect the database
    await mongoose.connect(dbConnString, clientOptions);
    await mongoose.connection.db?.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const server = createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*', // Replace with your frontend's domain
            methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        }
    },);

    io.on('connection', (socket) => {


        console.log('a user connected!');
        socket.on('send message', (chat) => {
            io.emit('send message', chat);
        })
    });

    GroupChat.watch().on('change', (change) => {
        console.log('change detected ', change);

        io.emit('message-update', change);
    })

    // User.collection.deleteMany();
    // Product.collection.deleteMany();
    // Review.collection.deleteMany();

    // Start the server
    const port = process.env.PORT;
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
}

main().catch(console.dir);