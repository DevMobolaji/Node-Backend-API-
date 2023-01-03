const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { LoadPlanetData } = require("../../models/planets.model");

describe("Launches API", () => {
    beforeAll(async () => {
        await mongoConnect();
        await LoadPlanetData();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe("Test GET /launch", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/V1/launches")
                .expect(200)
                .expect("Content-Type", /json/);
          });
    });
    
    describe("Test POST /launch", () => {
        const completeLaunchData =  {
            mission: "USS Enterprise",
            rocket: "NCC-1701",
            target: "Kepler-62 f",
            launchDate: "January 21, 2031"
        }
    
        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC-1701",
            target: "Kepler-62 f",
        }
    
        const launchDataWithInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC-1701",
            target: "Kepler-62 f",
            launchDate: "zoot"
        }
        test("It should respond with 201 created", async () => {
            const response = await request(app)
            .post("/V1/launches")
            .send(completeLaunchData)
            .expect("Content-Type", /json/);
            expect(201);
    
        const requestDate = new Date(completeLaunchData.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
    
        expect(responseDate).toBe(requestDate)
        expect(response.body).toMatchObject(launchDataWithoutDate)
    
        });
    
        test("It should catch missing required properties", async () => {
            const response = await request(app)
            .post("/V1/launches")
            .send(launchDataWithoutDate)
            .expect("Content-Type", /json/);
            expect(400);
    
        expect(response.body).toStrictEqual({
            error: "Missing some Launch Porperty"
        })
    });
    
        test("It should catch invalid dates", async () => {
            const response = await request(app)
            .post("/V1/launches")
            .send(launchDataWithInvalidDate)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(response.body).toStrictEqual({
            error: "Invalid Launch Date"
        })
    })
    
    });
})
