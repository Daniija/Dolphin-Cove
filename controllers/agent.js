//moduler 
var mysql = require('mysql');

//authentication check
exports.authentication = (req, res, next) => {
   
   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('agent/home', { agent: "" });
   }
}

// show the home page
exports.getHome = (req, res, next) => {

   if (req.session.mail != undefined) {
      return res.render('agent/home', { agent: req.session.mail });
   }
   else {
      return res.render('agent/home', { agent: "" });
   }
}

//show the login page
exports.getLogin = (req, res, next) => {
   res.render('agent/loginAccount', { agent: "", msg: [], err: [] });
}

//post page of login
exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });

   data = "SELECT * " +
      "FROM  agent " +
      "WHERE email = " + mysql.escape(req.body.mail) +
      " AND password = " + mysql.escape(req.body.pass);


   connectDB.query(data, (err, result) => {
      if (err) throw err; // show if any error have
      else {
         if (result.length) {
            req.session.mail = result[0].email;
            res.render('agent/home', {agent: result[0].email});
         }
         else {
            res.render('agent/loginAccount', { agent: "", msg: [], err: ["Please Check Your information again"] });
         }
      }
   })

}


// show create account page
exports.getCreateAccount = (req, res, next) => {
   res.render('agent/createAccount', { agent: "", msg: [], err: [] })
}

//get data from agent for create account
exports.postCreateAccount = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });

   var p1 = req.body.pass;
   var p2 = req.body.con_pass;

   if (p1 != p2) { // if password doesn't match 
      return res.render("agent/createAccount", { agent: "", msg: [], err: ["Password Doesn't Match"] })
   }

   var data = "INSERT INTO agent " +
      " VALUES ( '" + req.body.name + "' ,'" + req.body.mail + "','" + req.body.phone + "','" + p1 + "')";

   connectDB.query(data, (err, result) => {
      if (err) throw err;// if db has error, show that 
      else {
         res.render('agent/loginAccount', { agent: "", msg: ["Account Create Successfuly"], err: [] }); //show login page
      }
   })
}

//get request for category
exports.getCategory = (req, res, next) => {

   res.render('agent/category', { agent: req.session.mail });
}

//post request of category
exports.postCategory = (req, res, next) => {
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  category " +
      " WHERE name = " + mysql.escape(req.body.cat) +
      " AND type = " + mysql.escape(req.body.type) +
      " AND available > 0";

   connectDB.query(data, (err, result) => {
      if (err) throw err; //show if error found
      else {
         //console.log(result);
         return res.render('agent/showCategory', { agent: req.session.mail, events: result })
      }
   })

}

// get booking data 
exports.postBooking = (req, res, next) => {
   // console.log(req.body);

   res.render('agent/bookingConfirm', { agent: req.session.mail, name: req.body.name, type: req.body.type, cost: req.body.cost });
}

//post status request

exports.postStatus = (req, res, next) => {

   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });
   var date = req.body.date;
   //console.log(date)
   data = "INSERT INTO bookingstatus " +
      " VALUES ('" + req.session.mail + "','" + req.body.name + "','" + req.body.type + "','" + req.body.amt_of_prsn + "','" + 0 + "','" + date + "')"

   data1 = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);
      
   connectDB.query(data, (err, reslt) => {
      if (err) throw err;
      else {
         connectDB.query(data1, (err1, result) => {
            for (i in result) {
               var a = result[i].date
               a = a.toString()
               result[i].date = a.slice(0, 15);
            }
            res.render('agent/statusShow', { agent: req.session.mail, msg: "Your booking is placed", err: "", data: result });
         })
      }
   })
}


//get status
exports.getShowStatus = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });

   data = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);

   connectDB.query(data, (err, result) => {

      if (err) throw err;
      else {
         for (i in result) {
            var a = result[i].date
            a = a.toString()
            result[i].date = a.slice(0, 15);
         }
         if (result.length < 1) {
            res.render('agent/statusShow', { agent: req.session.mail, msg: "", err: "You dont have any data", data: result });
         }
         else {
            res.render('agent/statusShow', { agent: req.session.mail, msg: "", err: "", data: result });
         }
      }
   })
}


//delete booking request
exports.deleteBooking =(req,res,next)=>{
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      agent: "root",
      password: "password",
      database: "hotel"
   });

   data = "DELETE FROM bookingstatus " +
   " WHERE email = " + mysql.escape(req.body.mail) +
   " AND type = " + mysql.escape(req.body.type) +
   " AND category = " + mysql.escape(req.body.cat)+
   " AND amt_of_prsn = "+mysql.escape(req.body.want)
  
   connectDB.query(data,(err,result)=>{
      if(err) throw err;
      else{
         next();
      }
   })

}


//show contact page
exports.getContact =(req,res,next)=>{
   if(req.session.mail== undefined){
      res.render('agent/contact', { agent: "" });
   }
   else{
      res.render('agent/contact', { agent: req.session.mail });
   }
   
}

//logout
exports.logout = (req, res, next) => {
   req.session.destroy();
   res.render('agent/home', { agent: "" });

}