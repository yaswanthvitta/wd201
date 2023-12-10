const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};
const dateToday = new Date();
const today = formattedDate(dateToday);
const { Op } = require("sequelize");
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
      const a = await Todo.overdue();
      const todolist = a.map((todo) => todo.displayableString());
      for (let i = 0; i < todolist.length; i++) {
        console.log(todolist[i]);
      }
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const b = await Todo.dueToday();
      const todolist2 = b.map((todo) => todo.displayableString());
      for (let i = 0; i < todolist2.length; i++) {
        console.log(todolist2[i]);
      }

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const c = await Todo.dueLater();
      const todolist3 = c.map((todo) => todo.displayableString());
      for (let i = 0; i < todolist3.length; i++) {
        console.log(todolist3[i]);
      }
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
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
          dueDate: {
            [Op.gt]: today,
          },
        },
      });
      return todos;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        },
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      if (this.dueDate == today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
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
