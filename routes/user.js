const express = require('express');
const path = require('path');


const router = express.Router();

const userController = require('../controllers/user');

router.get('/',userController.getHome); //home page 

router.route('/login')
       .get(userController.getLogin) // get request for login
       .post(userController.postLogin)// post request for login

router.route('/createaccount') 
       .get(userController.getCreateAccount)    //get request for create account   
       .post(userController.postCreateAccount); //post request for create account   

router.route('/category')
       .get(userController.authentication,userController.getCategory) //get request for Category  
       .post(userController.postCategory) //post request form the category

router.route('/booking')
       .post(userController.postBooking) //post booking data    
       
router.route('/status')
       .post(userController.postStatus); 

router.route('/showStatus')
       .get(userController.authentication,userController.getShowStatus);// get show status

router.post('/deletereq',userController.deleteBooking,userController.getShowStatus);       
       
router.get('/contact',userController.getContact);       

router.get('/logout',userController.logout); //logout       

module.exports = router;