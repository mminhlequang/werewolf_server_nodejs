let mongoose = require('mongoose');

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dbName = process.env.DB_NAME;

const disconnected = 0;
const connected = 1;
const connecting = 2;
const disconnecting = 3;

class Database {
    constructor () {
        this._connect();
    }
    _connect () {
        const state = mongoose.connection.readyState;
        console.log("Mongoose state:", state);
        if (state == disconnected || state == disconnecting) {
            var mongoURI = `mongodb+srv://${username}:${password}@${host}/${dbName}?retryWrites=true&w=majority`;
            mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    console.log('Database connection successful!');
                })
                .catch((error) => {
                    console.log(mongoURI);
                    console.error('Database connection error:', error.message);
                });
        }
    }
}

module.exports = new Database()
