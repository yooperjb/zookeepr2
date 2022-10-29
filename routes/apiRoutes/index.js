// this is landing page for any requests to /api
// /api/animals uses animalRoutes
// /api/zookeepers uses zookeeperRoutes
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');


router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;