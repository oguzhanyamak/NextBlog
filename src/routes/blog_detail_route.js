const router = require("express").Router();

const renderBlogDetail  = require("../controllers/blog_detail_controller");
const {updateReaction,deleteReaction} = require("../controllers/reaction_controller");
const {addToReadingList,removeFromReadingList} = require("../controllers/reading_list_controller");
const updateVisit = require("../controllers/visit_controller");

router.get("/:blogId", renderBlogDetail);
router.put("/:blogId/reactions", updateReaction);
router.delete("/:blogId/reactions", deleteReaction);
router.put("/:blogId/readingList", addToReadingList);
router.delete("/:blogId/readingList", removeFromReadingList);
router.put("/:blogId/visit", updateVisit);

module.exports = router;
