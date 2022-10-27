const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');
const { type } = require('os');
// This will set the PORT to the environment variable set by Heroku or Dreamhost or use 80
const PORT = process.env.PORT || 80;
// heroku app fathomless-brook-93890

const app = express();

// middleware for parsing data
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse income JSON data
app.use(express.json());
// location for our static files
app.use(express.static('public'));

function filterByQuery(query, animalsArray) {
    console.log("query", query);
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    // check if personalityTraits is array (multiple traits) or string (single trait)
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each trait in personalityTraits array
        personalityTraitsArray.forEach(trait => {
            console.log('trait',trait);
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }

    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }

    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }

    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }

    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }

    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// GET request to /api/animals
app.get('/api/animals', (req, res) => {
    let results = animals;

    // if query exists
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // req is http request, query is method getting string after ?
    // if no query exists display full animals json file
    res.json(results);
});

// GET single animal
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    
    result ? res.json(result) : res.send(404);  
    // res.json(result);
});

// POST request to /api/animals
app.post('/api/animals', (req, res) => {
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

// this tells the server to listen on PORT which is configured above
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});