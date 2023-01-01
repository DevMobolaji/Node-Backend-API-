const { 
    getAllLaunches, 
    scheduleNewLaunch, 
    existsLaunchWithId, 
    abortLaunchById 
} = require("../../models/launch.model");
const getQueryPagination = require("../../services/query");

const httpGetAllLaunches = async (req, res) => {
    const { skip, limit } = getQueryPagination(req.query);
    const paginatedLaunches = await getAllLaunches(skip, limit)
    return res.status(200).json(paginatedLaunches);
}

const httpAddNewLaunch = async (req, res) => {
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing some Launch Porperty"
        });
    }
    launch.launchDate = new Date(launch.launchDate)

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid Launch Date"
        })
    }

    // if (launch.launchDate.toString() === "Invalid Date") {
    //     return res.status(400).json({
    //         error: "Invalid Launch Date"
    //     })
    // }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch)
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existLaunch = await existsLaunchWithId(launchId)

    if (!existLaunch) {
        return res.status(404).json({
            error: "Launch not found"
        })
    }

    const aborted = await abortLaunchById(launchId)

    if(!aborted) {
        return res.status(400).json({
            error: "Something expected happened!! Launch not aborted"
        })
    }
    return res.status(200).json({
        ok: true
    });

}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}