const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//mongo stuff
require("dotenv").config();
const Person = require("./models/person");
const { response } = require("express");

//morgan conf
morgan.token("body", (req, res) => JSON.stringify(req.body));

const app = express();
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = process.env.PORT || 3001;

app.get("/api/persons", (req, res) => {
  Person.find().then((persons) => res.json(persons));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: "content missing" });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((e) => next(e));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((e) => next(e));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((e) => next(e));
});

app.get("/info", (req, res, next) => {
  const time = new Date();
  Person.find()
    .then((result) =>
      res.send(
        `<div><div><p>Phonebook has info for ${result.length} people<p></div><div><p>${time}</p></div></div>`
      )
    )
    .catch((e) => next(e));
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    useFindAndModify: false,
  })
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((e) => next(e));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (e, req, res, next) => {
  console.log("Error:", e);
  res.status(400).send({ error: e });
  next(e);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
