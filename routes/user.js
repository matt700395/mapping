const express = require('express');
const { signup } = require('../controllers/signup');

const router = express.Router();

router.get('/', signup);

module.exports = router;