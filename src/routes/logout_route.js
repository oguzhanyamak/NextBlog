const router = require('express').Router();

const logOut = require('../controllers/logout_controller');

router.post('/',logOut);

module.exports = router;