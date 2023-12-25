const express = require("express");
const fs = require("fs");

const app = express();

//simple middleware
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
    res.status(200).send({
        message: "Hello from the server side.",
        app: "Natours",
    });
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//get tours
app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: { tours },
    });
});

//get single tour
app.get("/api/v1/tours/:id", (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((item) => item.id === id);
    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        status: "success",
        data: { tour },
    });
});

//update tour
app.patch("/api/v1/tours/:id", (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(200).json({
        status: "success",
        data: "<Updated Tour here>",
    });
});

//delete tour
app.delete("/api/v1/tours/:id", (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

//post tours
app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newTour,
                },
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
