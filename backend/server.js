const express = require("express");
const cors = require("cors");

const processHierarchy = require("./utils/hierarchyProcessor");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BFHL API Running"
  });
});

app.post("/bfhl", (req, res) => {

    const { data } = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({
            error: "data must be array"
        });
    }

    const result = processHierarchy(data);

    res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});