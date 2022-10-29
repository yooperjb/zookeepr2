const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal,} = require("../../lib/animals");
const { animals } = require("../../data/animals");

// animal api routes /api/
// GET request to /api/animals
router.get('/animals', (req, res) => {
    let results = animals;

    // if query exists
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // req is http request, query is method getting string after ?
    // if no query exists display full animals json file
    res.json(results);
});

// GET single animal /api/animals/:id
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    
    result ? res.json(result) : res.send(404);  
    // res.json(result);
});

// POST request to /api/animals
router.post('/animals', (req, res) => {
    // set id based on length of animals array
    req.body.id = animals.length.toString();
    
    // if any data in req.body is incorrect, send 400 error
    // if correct, add animal to json file and animals array
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
       const animal = createNewAnimal(req.body, animals);
       res.json(req.body);
    }
    
    // req.body is where our incoming content will be
    console.log(req.body);
});

module.exports = router;