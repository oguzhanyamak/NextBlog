const router = require('express').Router();

const renderHome = require('../controllers/home_controller');

router.get('/',renderHome);

module.exports = router;