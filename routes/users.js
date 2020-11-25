const express = require('express');

const UsersController = require('../controllers/users');
const authToken = require('../middleware/permissions/authToken');

const router = express.Router();

router.post('/signup', UsersController.signup);
router.post('/login', UsersController.login);
router.get('/', authToken, UsersController.get_all_users);
router.post('/', authToken, UsersController.create_user);
router.get('/:id', authToken, UsersController.get_single_user);
router.patch('/:id', authToken, UsersController.update_user);
router.delete('/:id', authToken, UsersController.delete_user);

module.exports = router;