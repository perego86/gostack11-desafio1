const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


//Middleware to check if the ID exists
function checkIDExists(req,res,next) {
  const id  = req.params.id;
  
  if(!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const repository = repositories.find(item =>item.id == id);
  
  if (!repository) {
    return res.status(400).json({ error: 'ID does not exist' });
  }

  req.repository = repository;
  
  return next();
}


app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const {title,url, techs=[]} = req.body;
  
  const repository = {id:uuid() , title, url, techs, likes:0}
  
  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", checkIDExists,(req, res) => {
  const {title, url, techs} = req.body;

  req.repository.title = title;
  req.repository.url = url;
  req.repository.techs = techs;
  
  return res.json(req.repository);
  
   
});

app.delete("/repositories/:id",checkIDExists, (req, res) => {

  const repositoryIndex = repositories.findIndex(repository => repository.id === req.repository.id)
   
  repositories.splice(repositoryIndex,1);
  
  return res.send(204);
});

app.post("/repositories/:id/like", checkIDExists,(req, res) => {
  
  req.repository.likes += 1
    
  return res.json({likes: req.repository.likes}) ;
});

module.exports = app;
