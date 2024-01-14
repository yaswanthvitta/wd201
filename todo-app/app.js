/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");

const passport = require("passport");
const connectEnsure = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const { doesNotMatch } = require("assert");
const { error } = require("console");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const flash = require("connect-flash");

app.use(
  session({
    secret: "my-super-secret-key-7075625299",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(flash());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.set("views", path.join(__dirname, "views"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serializeing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  response.render("index", {
    csrfToken: request.csrfToken(),
  });
});

app.get("/todos", connectEnsure.ensureLoggedIn(), async (request, response) => {
  const allTodos = await Todo.getTodo();
  if (request.accepts("html")) {
    response.render("todos", {
      allTodos,
      user: request.user.id,
      csrfToken: request.csrfToken(),
    });
  } else {
    return response.json({ allTodos });
  }
});

app.get("/todos", async (request, response) => {
  try {
    const todo = await Todo.getTodo();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post(
  "/todos",
  connectEnsure.ensureLoggedIn(),
  async (request, response) => {
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
          userId: request.user.id,
        });
      }
      return response.redirect("/todos");
    } catch (error) {
      response.render(request.flash(error, "missing values"));
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.put(
  "/todos/:id",
  connectEnsure.ensureLoggedIn(),
  async (request, response) => {
    console.log("We have to update a todo with ID:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus(todo.completed);
      return response.json(updatedTodo);
    } catch (error) {
      return response.status(422).json(error);
    }
  },
);

app.delete(
  "/todos/:id",
  connectEnsure.ensureLoggedIn(),
  async (request, response) => {
    console.log("Delete a todo by ID:", request.params.id);
    try {
      const deletedTodo = await Todo.deletedTodo(
        request.params.id,
        request.user.id,
      );

      if (JSON.stringify(deletedTodo) == "0") {
        return response.send(false);
      } else {
        return response.send(true);
      }
    } catch (error) {
      return response.status(422).json(error);
    }
  },
);

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Sign-up",
    csrfToken: request.csrfToken(),
  });
});

app.post("/user", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    console.log(request.user);
    response.redirect("/todos");
  },
);

app.get("/signout", (request, response, next) => {
  request.logout((error) => {
    if (error) {
      return next(error);
    }
    response.redirect("/");
  });
});

module.exports = app;
