const express = require('express');
const router = express();
const controller = require(`../controllers/indexcontroller`);
const { verifyUser, adminOnly } = require(`../middleware/AuthUser.js`);

router.set('view engine', 'ejs');
router.use(express.static('public'));

router.get('/', controller.forum.getAllForum);
router.get('/dashboard', verifyUser, controller.forum.getAllDashboardForum);
router.get('/:id', controller.forum.getForumById);
router.post('/addForum', verifyUser, controller.forum.addForum);
router.put('/updateForum/:id', controller.forum.updateForum);
router.delete('/deleteForum/:id', controller.forum.deleteForum);
router.get('/comment/all', controller.forum.getAllComment);
router.get('/comment/:forum_id', controller.forum.getCommentById);
router.post('/addComment', verifyUser, controller.forum.addForumComment);
router.delete('/deleteComment/:id', controller.forum.deleteForumComment);
router.get('/total/totalforum', controller.forum.getTotalForum);

module.exports = router;
