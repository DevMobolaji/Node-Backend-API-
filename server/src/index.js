const http = require("http");
const PORT = process.env.PORT || 8000;
const app = require("./app");
require("dotenv").config();

console.log(process.env.PORT)

const { loadLaunchesData } = require("./models/launch.model");
const { LoadPlanetData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");

const server = http.createServer(app);


const startServer = async () => {
    await mongoConnect();
    await loadLaunchesData()
    await LoadPlanetData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();



