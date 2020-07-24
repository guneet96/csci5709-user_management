const mongoose = require('mongoose');
const config = require('config');
const database = config.get('mongoLink');

const connectDatabase = async () => {
    try {
        await mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connect to Mongo Atlas Database ");    
    } catch(e) {
        console.error(e.message);
        process.exit(1);
    }
}


module.exports = connectDatabase;