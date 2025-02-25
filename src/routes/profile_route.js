const router = require("express").Router();

const renderProfile = require("../controllers/profile_controller.js");

router.get(["/:username", "/:username/page/:pageNumber"], renderProfile);

module.exports = router;
