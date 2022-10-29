const fs = require('fs');
const path = require('path');

// Filter animals by personality traits
function filterByQuery(query, animalsArray) {
    // console.log("query", query);
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

// Get animal by id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// create a new animal - write to json object
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, '../data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}

// validate animal form values are correct
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};