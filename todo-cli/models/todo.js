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
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const a = Todo.overdue();
      for (let i = 0; i < a.length; i++) {
        a[i].displayableString();
      }

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const b = Todo.dueToday();
      for (let i = 0; i < b.length; i++) {
        b[i].displayableString();
      }

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const c = Todo.dueLater();
      for (let i = 0; i < c.length; i++) {
        c[i].displayableString();
      }
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const todos = await Todo.findAll({
        where: {
          dueDate: yesterday,
        },
      });
      return todos;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const todos = await Todo.findAll({
        where: {
          dueDate: today,
        },
      });
      return todos;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const todos = await Todo.findAll({
        where: {
          dueDate: tomorrow,
        },
      });
      return todos;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      const todo = await Todo.findOne({
        where: {
          id: id,
        },
      });

      todo.completed = true;
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
