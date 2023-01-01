const launches = require("./launches.mongo")
const planets = require('./planets.mongo');
const axios = require("axios")
// const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100;

async function populateLaunches() {
    console.log("Downloading launch data");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        "customers": 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200) {
        console.log("Problem downloading launch data")
        throw new Error("Launch data downlaod failed")
    }

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"];
        const customers = payloads.flatMap((payload) => {
            return payload["customers"]
        })
        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers
        }

        console.log(`${launch.flightNumber} - ${launch.mission}`);

        //Populate launches collections
        await saveLaunch(launch)
    }
}
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat",
    });

    if(firstLaunch) {
        console.log("Launch Data is already loaded");
    } else {
        await populateLaunches();
    }
    
}

// launches.set(launch.flightNumber, launch);
async function findLaunch(filter) {
    return await launches.findOne(filter)
}


async function existsLaunchWithId(launchId) {
    return findLaunch({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
    .findOne()
    .sort("-flightNumber");

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
    return await launches.find({}, {
        "__v": 0,
        "_id": 0
    })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
    // return Array.from(launches.values())
}

async function saveLaunch(launch) {
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, 
    launch, 
    {
        upsert: true
    })
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    });

    if(!planet) {
        throw new Error("No matching planet was found")
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["Zero To Mastery", "NASA"],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber += 1;
//     launches.set(latestFlightNumber, Object.assign(launch, {
//         upcoming: true,
//         success: true,
//         customers: ["Zero To Mastery", "NASA"],
//         flightNumber: latestFlightNumber,

//     }));
// }

async function abortLaunchById(launchId) {
   const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

   return aborted.modifiedCount === 1;
}



module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    scheduleNewLaunch,
    getAllLaunches,
    abortLaunchById
}