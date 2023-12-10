const todolist = require("../todo");
const { all, add, markAsComplete, overdue, dueLater, dueToday } = todolist();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};
const dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1)),
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1)),
);
add({ title: "Submit assignment", dueDate: yesterday, completed: false });
add({ title: "File taxes", dueDate: tomorrow, completed: false });

describe("test1", () => {
  test("test1", () => {
    expect(all.length).toBe(2);
    add({
      title: "Pay electric bill",
      dueDate: "2023-12-10",
      completed: false,
    });
    markAsComplete(0);
    expect(all.length).toBe(3);
  });

  test("test2", () => {
    expect(all[0].completed).toBe(true);
  });

  test("test3", () => {
    const a = overdue();
    console.log(a);
    expect(a[0].dueDate).toBe(yesterday);
  });

  test("test4", () => {
    const b = dueLater();
    console.log(b);
    expect(b[0].dueDate).toBe(tomorrow);
  });

  test("test5", () => {
    const c = dueToday();
    console.log(c);
    expect(c[0].dueDate).toBe(today);
  });
});
