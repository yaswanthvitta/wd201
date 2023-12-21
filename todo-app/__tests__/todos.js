const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;
describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });
  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(302);
  });
});

//   test("Mark a todo as complete", async () => {
//     const response = await agent.post("/todos").send({
//       title: "Buy milk",
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });
//     const parsedResponse = JSON.parse(response.text);
//     const todoID = parsedResponse.id;
//     expect(parsedResponse.completed).toBe(false);
//     const markCompleteResponse = await agent
//       .put(`/todos/${todoID}/markAsCompleted`)
//       .send();
//     const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
//     expect(parsedUpdateResponse.completed).toBe(true);
//   });

//   test("Delete a todo", async () => {
//     const response = await agent.post("/todos").send({
//       title: "Buy milk",
//       dueDate: new Date().toISOString(),
//       completed: false,
//     });
//     const parsedResponse = JSON.parse(response.text);
//     const todoID = parsedResponse.id;
//     const markCompleteResponse = await agent.delete(`/todos/${todoID}`).send();
//     expect(markCompleteResponse.text).toBe("true");
//   });
// });
