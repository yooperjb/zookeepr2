const express = require('express');
const { animals } = require('./data/animals');
// heroku app fathomless-brook-93890

const app = express();

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

app.get('/api/animals', (req, res) => {
    let results = animals;

    // if query exists
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // req is http request, query is method getting string after ?
    // console.log(req.query)
    res.json(results);
});

app.listen(80, () => {
    console.log(`API server now on port 80!`);
});