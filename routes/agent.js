const express = require('express');
const path = require('path');


const router = express.Router();

const agentController = require('../controllers/agent');

router.get('/agent',agentController.getHome); //home page 

router.route('/login')
       .get(agentController.getLogin) // get request for login
       .post(agentController.postLogin)// post request for login

router.route('/createaccount') 
       .get(agentController.getCreateAccount)    //get request for create account   
       .post(agentController.postCreateAccount); //post request for create account   

router.route('/category')
       .get(agentController.authentication,agentController.getCategory) //get request for Category  
       .post(agentController.postCategory) //post request form the category

router.route('/booking')
       .post(agentController.postBooking) //post booking data    
       
router.route('/status')
       .post(agentController.postStatus); 

router.route('/showStatus')
       .get(agentController.authentication,agentController.getShowStatus);// get show status

router.post('/deletereq',agentController.deleteBooking,agentController.getShowStatus);       
       
router.get('/contact',agentController.getContact);       

router.get('/logout',agentController.logout); //logout       

module.exports = router;