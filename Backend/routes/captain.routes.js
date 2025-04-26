const express = require('express');
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const { authCaptain } = require('../middlewares/captain.middleware');
const router = express.Router();


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage("name must be at least 3 characters long"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').isLength({ min: 3 }).withMessage("Vehicle color must be at least 3 characters long"),
    body('vehicle.plate').isLength({ min: 3 }).withMessage("Vehicle plate must be at least 3 characters long"),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage("Vehicle capacity must be at least 1"),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage("Vehicle type must be one of the following: car, motorcycle, auto")
]
    ,
    captainController.registerCaptain
)


router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")

],
    captainController.loginCaptain
);


router.get('/profile',authCaptain,captainController.getCaptainProfile);

router.get('/logout',authCaptain,captainController.logoutCaptain);


module.exports = router;