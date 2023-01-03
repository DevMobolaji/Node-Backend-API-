require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = 'mongodb+srv://TechProf:Makanaki_12345@beejaycodes.iwhuw.mongodb.net/?retryWrites=true&w=majority'
console.log(MONGO_URI)

mongoose.connection.once("open", () => {
    console.log("MongDB connection ready!");
});

mongoose.connection.on("error", (err) => {
    console.error(err)
});

mongoose.set('strictQuery', false);

async function mongoConnect () {
    await mongoose.connect(MONGO_URI) 
        // { 
        //     useNewUrlParser: true, 
        //     useUnifiedTopology: true,
        // });
} 


async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}

