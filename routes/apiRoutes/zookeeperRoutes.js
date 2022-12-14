const router = require("express").Router();
const { filterByQuery, findById, createNewZookeeper, validateZooKeeper } = require("../../lib/zookeepers");
const { zookeepers } = require("../../data/zookeepers");
// const { route } = require("./animalRoutes");

router.get("/zookeepers", (req, res) => {
    let results = zookeepers;
    console.log("zookeepers", zookeepers);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get("/zookeepers/:id", (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post("/zookeepers", (req,res) => {
    req.body.id = zookeepers.length.toString();

    if (!validateZooKeeper(req.body)) {
        res.status(400).send("The zookeeper is not properly formatted!");
    } else {
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports = router;