/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const{Todo}=require("./models")
const bodyParser=require('body-parser')
app.use(bodyParser.json());

app.get("/",(request,response)=>{
   console.log("Todo list")

})

app.post("/todos",async (request,response)=>{
    console.log("Creating a todo",request.body)
try{
    const todo= await Todo.addTodo({title: request.body.title, dueDate: request.body.dueDate,compleated:false})
  
    return response.json(todo)
}

catch(error){
    console.log(error)
    return response.status(422).json(error)
}

})

app.put("/todos/:id/markAsCompleted",async (request,response)=>{
   console.log("We have to update a todo with ID:",request.params.id)
  const todo = await Todo.findByPk(request.params.id) 
  try{
  const updatedTodo = await todo.markAsCompleted()
  return response.json(updatedTodo)
  }
  catch(error){
    return response.status(422).json(error)
  }

})

app.delete("/todos/:id",(request,response)=>{
    console.log("Delete a todo by ID:",request.params.id)
})


module.exports =app;