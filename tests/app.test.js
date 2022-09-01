const request = require("supertest");
const pastes = require("../src/data/pastes-data");
const app = require("../src/app");

function generateMockData(){
  return [...pastes]
};

describe(`path "/pastes"`, () => {
    beforeEach(() => {
        //can also just set .length to 0
        pastes.splice(0, pastes.length); // Clears out the pastes data
      });

    describe("GET method", () => {
        it("returns an array of pastes", async () => {
          const expected = generateMockData();
    
          pastes.push(...expected)
          const response = await request(app).get("/pastes");

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);
        });
    });

    describe("POST method", () => {
        it("creates a new paste and assigns id", async () => {
            const newPaste = {
                name: "String Reverse in JavaScript",
                syntax: "Javascript",
                expiration: 24,
                exposure: "public",
                text: "const stringReverse = str => str.split('').reverse().join('');"
              };
              const response = await request(app)
                .post("/pastes")
                .set("Accept", "application/json")
                .send({ data: newPaste });
          
              expect(response.status).toBe(201);
              expect(response.body.data).toEqual({
                id: 5,
                ...newPaste,
            });
        })


        it("returns 400 if result is missing", async () => {
        const response = await request(app)
            .post("/pastes")
            .set("Accept", "application/json")
            .send({ data: { message: "returns 400 if result is missing" } });
    
        expect(response.status).toBe(400);
        });
    
        it("returns 400 if result is empty", async () => {
        const response = await request(app)
            .post("/pastes")
            .set("Accept", "application/json")
            .send({ data: { result: "" } });
    
        expect(response.status).toBe(400);
        });
    })
});