import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';
import app from './app';
import User from './models/user';
import Product from './models/product';

const dbConnString = process.env.DB_CONN_STRING;

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

    // User.collection.deleteMany();
    // Product.collection.deleteMany();

    // Start the server
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Application is running on port ${port}`);
    })
}

main().catch(console.dir);