import express from "express";
const app = express();
const port = 8080;

app.use(express.json());

type TeaData = {
  id: string;
  name: string;
  price: string;
};

let teaData: TeaData[] = [];
let nextId = 1;

app.post("/teas", (req, res) => {
  const { name, price } = req.body;
  const id = (nextId++).toString();
  const newData = { id, name, price };
  teaData.push(newData);
  res.send(newData);
});

app.get("/teas", (req, res) => {
  res.send(teaData);
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
