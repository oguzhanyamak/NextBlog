const router = require('express').Router();

const {renderBlogDetail} = require('../controllers/blog_detail_controller');

router.get('/:blogId',renderBlogDetail);
//router.post('/',);

module.exports = router;