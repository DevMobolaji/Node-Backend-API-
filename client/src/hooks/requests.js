const API_URL = "http://localhost:8000/V1"

async function httpGetPlanets() {
  const result = await fetch(`${API_URL}/planets`);
  console.log(result.body)
  return await result.json();
  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunched = await response.json()
  return fetchedLaunched.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  });
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
    try {
      return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch),
    });
    } catch(err) {
      console.log(err)
      return {
        ok: false
      }
    }
    
    // TODO: Once API is ready.
    // Submit given launch data to launch system.
  }

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    })
  } catch (error) {
    return {
      ok: false
    }
  }

  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};