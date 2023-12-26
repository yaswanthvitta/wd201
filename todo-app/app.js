/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodo();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async (request, response) => {
  try {
    const todo = await Todo.getTodo();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  try {
    if (
      request.body.title != null ||
      request.body.title != "" ||
      request.body.dueDate != null ||
      request.body.dueDate != ""
    ) {
      const todo = await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        completed: false,
      });
    }
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(todo.completed);
    return response.json(updatedTodo);
  } catch (error) {
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID:", request.params.id);
  try {
    const deletedTodo = await Todo.deletedTodo(request.params.id);

    if (JSON.stringify(deletedTodo) == "0") {
      return response.send(false);
    } else {
      return response.send(true);
    }
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
