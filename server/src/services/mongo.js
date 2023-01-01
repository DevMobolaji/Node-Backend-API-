const { mongoose } = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI

mongoose.connection.on("open", () => {
    console.log("MongDB connection ready!");
});

mongoose.connection.on("error", (err) => {
    console.error(err)
});

async function mongoConnect () {
    await mongoose.connect(MONGO_URI, 
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
} 

mongoose.set('strictQuery', true);

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}

