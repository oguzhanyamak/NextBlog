const router = require("express").Router();

const renderBlogDetail  = require("../controllers/blog_detail_controller");
const {updateReaction,deleteReaction} = require("../controllers/reaction_controller");

router.get("/:blogId", renderBlogDetail);
router.put("/:blogId/reactions", updateReaction);
router.delete("/:blogId/reactions", deleteReaction);

module.exports = router;
