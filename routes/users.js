const express = require('express');

const UsersController = require('../controllers/users');
const authUser = require('../middleware/permissions/authUser');

const router = express.Router();

router.get('/', UsersController.get_all_users);
router.post('/', UsersController.create_user);
router.get('/:id', authUser, UsersController.get_single_user);
router.patch('/:id', UsersController.update_user);
router.delete('/:id', UsersController.delete_user);
router.post('/signup', UsersController.signup);
router.post('/login', UsersController.login);

module.exports = router;