require("dotenv").config();
import express from "express";
import logger from "./logger.ts";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

app.post("/teas", (req, res) => {
  logger.info("a post req is made to /tea");
  const { name, price } = req.body;
  const id = (nextId++).toString();
  const newData = { id, name, price };
  teaData.push(newData);
  res.send(newData);
});

app.get("/teas", (req, res) => {
  logger.warn("warn ");
  res.status(201).send(teaData);
});

app.get("/teas/:id", (req, res) => {
  const { id } = req.params;
  const data = teaData.find((singleData) => singleData.id == id);
  res.send(data);
});

app.put("/teas/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  teaData.find((t) => {
    if (t.id === id) {
      t.name = name;
      t.price = price;
    }
  });
  res.send({ message: "Update succesfully", teaData });
});

app.delete("/teas/:id", (req, res) => {
  const { id } = req.params;

  const updatedTeaData = teaData.filter((t) => t.id !== id);
  teaData = updatedTeaData;
  res.send({ message: "Update succesfully", teaData });
});

app.listen(port, () => {
  console.log(`Server is running in ${port}.`);
});
