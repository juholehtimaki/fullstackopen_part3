const express = require("express");
const morgan = require("morgan");

//morgan conf
morgan.token("body", (req, res) => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const PORT = process.env.PORT || 3001;

let persons = [
  { name: "Arto Hellas", number: "040-123456", id: "1" },
  { name: "Ada Lovelace", number: "39-44-5323523", id: "2" },
  { name: "Dan Abramov", number: "12-43-234345", id: "3" },
  { name: "Mary Poppendieck", number: "39-23-6423122", id: "4" },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  let result = persons.find((person) => person.id == req.params.id);
  if (result) res.json(result);
  else res.sendStatus(404);
});

app.delete("/api/persons/:id", (req, res) => {
  let index = persons.findIndex((person) => person.id == req.params.id);
  if (index > -1) {
    persons.splice(index, 1);
    res.sendStatus(200);
  } else res.sendStatus(404);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "name missing" });
    return;
  }
  if (!req.body.number) {
    res.status(400).json({ error: "number missing" });
    return;
  }
  for (let person of persons) {
    if (person.name === req.body.name) {
      res.status(400).json({ error: "name must be unique" });
      return;
    }
  }
  const generatedId = (Math.floor(Math.random() * 1000) + 1).toString();
  persons.push({
    name: req.body.name,
    number: req.body.number,
    id: generatedId,
  });
  res.sendStatus(200);
});

app.get("/info", (req, res) => {
  const time = new Date();
  res.send(
    `<div><div><p>Phonebook has info for ${persons.length} people<p></div><div><p>${time}</p></div></div>`
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
