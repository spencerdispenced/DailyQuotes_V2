const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { validateUser } = require('../middleware/validateUser');

const users = require('../controllers/users');

router.post('/register', validateUser, catchAsync(users.createNewUser));

router.get('/confirm/:confirmationCode', catchAsync(users.confirmSignup));

router.delete('/unsubscribe/:uuid', catchAsync(users.deleteUser));

router.get('/status/:uuid/:status', catchAsync(users.renderStatusPage));

router.get('/goodbye', users.renderUnsubcribedPage);

module.exports = router;
