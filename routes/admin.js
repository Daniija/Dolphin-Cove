const express = require('express');
const path = require('path');


const router = express.Router();

const adminController = require('../controllers/admin');


router.route('/')
   .get(adminController.getLogin) //get request
   .post(adminController.postLogin) // post request

router.get('/logout',adminController.logout) //get request   

router.post('/chnagestatus',adminController.postChnageStatus)// post change status

router.route('/addevent')
      .get(adminController.getAddevent) // get request for hotel add page
      .post(adminController.postAddevent) // post request for hotel add to db

router.route('/addagent')
      .get(adminController.getaddagent) // get request for add agent page
      .post(adminController.postaddagent) //post request for add agent page

router.route('/agentprofile')
      .get(adminController.getagentprofile) // get request for agentprofile page
      .post(adminController.postagentprofile) //post request for agent page

router.route('/deleteagent')
      .get(adminController.getdeleteagent) // get request for agentprofile page
      .post(adminController.postdeleteagent) //post request for agent page

router.route('/editagent')
      .get(adminController.getediteagent) // get request for agentprofile page
      .post(adminController.posteditagent) //post request for agent page

router.route('/profile')
      .get(adminController.getprofile) // get request for agentprofile page
      .post(adminController.postprofile) //post request for agent page

router.route('/profileedit')
      .get(adminController.getprofileedit) // get request for agentprofile page
      .post(adminController.postprofileedit) //post request for agent page

router.route('/search')
      .get(adminController.getSearch)   // get request   
      .post(adminController.postSearch) // post request

router.route('/update')
      .post(adminController.getUpdate) //get update page for post request
      
router.route('/updateData')
      .post(adminController.updatePrevData) // update prev data      


module.exports = router;