const express = require('express');
const controller = require('../controllers/indexcontroller');
const router = express.Router();
router.use(express.static('public'));

router.get('/', controller.daftaruser.getAllUser);
router.get('/:id', controller.daftaruser.getUserById);
router.delete('/deleteUser/:id', controller.daftaruser.deleteUser);
router.get('/user/total', controller.daftaruser.getTotalUsers);

module.exports = router;
