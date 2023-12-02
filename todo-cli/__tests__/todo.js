const todolist = require("../todo");
const { all, add, markAsComplete } = todolist();

describe("test1", () => {
  test("test1", () => {
    expect(all.length).toBe(0);
    add({
      title: "Pay electric bill",
      dueDate: "2023-12-03",
      completed: false,
    });
    markAsComplete(0);
    expect(all.length).toBe(1);
  });

  test("test2", () => {
    expect(all[0].completed).toBe(true);
  });
});
