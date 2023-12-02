const todoList = () => {
  // eslint-disable-next-line no-undef
  const all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };
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

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    const a = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate === yesterday) {
        a.push(all[i]);
      }
    }
    return a;
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    const b = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate === today) {
        b.push(all[i]);
      }
    }
    return b;
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    const c = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].dueDate === tomorrow) {
        c.push(all[i]);
      }
    }
    return c;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    let s = "";
    for (let i = 0; i < list.length; i++) {
      if (list[i].completed === true) {
        if (list[i].dueDate === today) {
          s = s + ("[x] " + list[i].title) + "\n";
        } else {
          s =
            s +
            ("[x] " + list[i].title + " " + list[i].dueDate.toString()) +
            "\n";
        }
      } else {
        if (list[i].dueDate === today) {
          s = s + ("[ ] " + list[i].title) + "\n";
        } else {
          s =
            s +
            ("[ ] " + list[i].title + " " + list[i].dueDate.toString()) +
            "\n";
        }
      }
    }
    return s.slice(0, -1);
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

const todos = todoList();

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

todos.add({ title: "Submit assignment", dueDate: yesterday, completed: false });
todos.add({ title: "Pay rent", dueDate: today, completed: true });
todos.add({ title: "Service Vehicle", dueDate: today, completed: false });
todos.add({ title: "File taxes", dueDate: tomorrow, completed: false });
todos.add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });

// console.log('My Todo-list\n')

// console.log('Overdue')
// const overdues = todos.overdue()
// const formattedOverdues = todos.toDisplayableList(overdues)
// console.log(formattedOverdues)
// console.log('\n')

// console.log('Due Today')
// const itemsDueToday = todos.dueToday()
// const formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
// console.log(formattedItemsDueToday)
// console.log('\n')

// console.log('Due Later')
// const itemsDueLater = todos.dueLater()
// const formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
// console.log(formattedItemsDueLater)
// console.log('\n\n')

module.exports = todoList;
