const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.show_all_accounts);
router.post('/', accountController.register_account);
router.post('/auth', accountController.login);
router.put('/:id/password', accountController.change_password);
router.put('/:id', accountController.change_info);

module.exports = router;
