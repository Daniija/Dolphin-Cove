var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');


// login get request
exports.getLogin = (req, res, next) => {
    if (req.session.admin == undefined) {
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        var connectDB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "password",
            database: "hotel"
        });
        data1 = "SELECT * " +
            "FROM  bookingstatus " +
            "WHERE status = 0 ";
        connectDB.query(data1, (err1, result1) => {
            if (err1) throw err1;
            else {
                for (i in result1) {
                    var a = result1[i].date;
                    result1[i].date = a.toString().slice(0, 15);
                }
                return res.render('admin/index', { msg: "", err: "", data: result1 });
            }
        })
    }

}

//login post request
exports.postLogin = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM admin " +
        "WHERE name = " + mysql.escape(req.body.name) +
        "AND pass = " + mysql.escape(req.body.pass);

    data1 = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else { 
            if (result.length) {
                req.session.admin = result[0].name;
                connectDB.query(data1, (err1, result1) => {
                    if (err1) throw err1;
                    else {
                        for (i in result1) {
                            var a = result1[i].date;
                            result1[i].date = a.toString().slice(0, 15);
                        }
                        return res.render('admin/index', { msg: "", err: "", data: result1 });
                    }
                })

            }
            else {
                return res.render('admin/login', { msg: "", err: "Please Check Your Information Again" });
            }
        }
    })
}

//change booking status
exports.postChnageStatus = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    var value = 0;

    if (req.body.click == "Approve") {
        value = 1;
        data = "UPDATE bookingstatus " +
        " SET  status = " + mysql.escape(value) +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND amt_of_prsn = " + mysql.escape(req.body.want)

    } else {
        data = "DELETE FROM bookingstatus " +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND amt_of_prsn = " + mysql.escape(req.body.want)
    }
    
    data1 = "SELECT * " +
        "FROM  bookingstatus " +
        "WHERE status = 0 ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(data1, (err1, result1) => {
                if (err1) throw err1;
                else {
                    for (i in result1) {
                        var a = result1[i].date; 
                        result1[i].date = a.toString().slice(0, 15);
                    }
                    return res.render('admin/index', { msg: "", err: "", data: result1 });
                }
            })
        }
    })

}

//get add event page

exports.getAddevent = (req, res, next) => {
    res.render('admin/addevent', { msg: "", err: "" });
}

//add new event info
exports.postAddevent = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    //variables
    var cat = "", type = "", cost = 0, avlvl = 0, des = ""
   var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "cat") {
                cat = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "cost") {
                cost = parseInt(field);
            }
            else if (name === "avlvl") {
                avlvl = parseInt(field);
            }
            else if (name === "des") {
                des = field
            }

        })
        .on('file', (name, file) => {
            // console.log('Uploaded file', name)
            //   fs.rename(file.path,__dirname+"a")
        })
        .on('fileBegin', function (name, file) {
            //console.log(mail);

            var fileType = file.type.split('/').pop();
            if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {

                a = path.join(__dirname, '../')
                ///  console.log(__dirname)
                //  console.log(a)
                if (name === "img") {
                    imgPath = (cat + type + cost + "." + fileType);
                }
                imgPath ='/assets/img/rooms/' + (cat + type + cost + "." + fileType)
                file.path = a + '/public/assets/img/rooms/' + (cat + type + cost + "." + fileType); // __dirname
            } else {
                console.log("Wrong File type")
                wrong = 1;
                res.render('admin/addevent', { msg: "", err: "Wrong File type" });
            }
        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {

            if (wrong == 1) {
                console.log("Error")
            }
            else {

                //saveDir = __dirname + '/uploads/';
                
                data = "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) "+
                         "VALUES('" +cat + "','" + type + "', '" + cost + "','" +avlvl + "' ,'" + imgPath + "' ,'" + des + "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addevent', { msg: "Data Insert Successfuly", err: "" });
                    }
                });
            }
        })
}

// get addagent page
exports.getaddagent = (req, res, next) => {
    res.render('admin/addagent', {msg:"", err:""})
}

// post request
exports.postaddagent = (req, res, next) => {
    // console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    //variables
    var Aname = "", email = "", phone = 0, password = "", address = "", gender = ""
    var imgPath=""
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
        if (name === "Aname") {
            name = field;
        }
        else if (name === "email") {
            email = field;
        }
        else if (name === "phone") {
            phone = parseInt(field);
        }
        else if (name === "password") {
            password = field;
        }
        else if (name === "address") {
            address = field;
        }
        else if (name === "gender") {
            gender = field;
        }
    })

    .on('file', (name, file) => {
        // console.log('Uploaded file', name)
        //   fs.rename(file.path,__dirname+"a")
    })
    .on('fileBegin', function (name, file) {
        // console.log(mail);

        var fileType = file.type.split('/').pop();
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {

            a = path.join(__dirname, '../')
            //  console.log(__dirname)
            //  console.log(a)
            if (name === "img") {
                imgPath = (Aname + email + phone + password + address + gender + fileType);
            }
            imgPath ='/assets/img/rooms/' + (Aname + email + phone + password + address + gender + fileType)
            file.path = a + '/public/assets/img/rooms/' + (Aname + email + phone + password + address + gender + imgPath + fileType); // __dirname
        } else {
            console.log("Wrong File type")
            wrong = 1;
            res.render('admin/addevent', { msg: "", err: "Wrong File type" });
        }
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
    })
    .on('end', () => {

        if (wrong == 1) {
            console.log("Error")
        }
        else {
            // query isnt working 
             
            //saveDir = __dirname + '/uploads/';
            data = "INSERT INTO `admin`(`Aname`, `email`, `phone`, `password`, `address`, `gender`, `img`) "+
                     "VALUES('" + Aname + "','" + email + "', '" + phone + "','" + password + "' ,'" + address + "' ,'" + gender + "' ,'" + imgPath + "' )"
            connectDB.query(data, (err, result) => {

                if (err) {
            console.log("data")
                    throw err;
                }
                else {
                    res.render('admin/addagent', { msg: "Data Insert Successfuly", err: "" });
                }
            });
        }
    })
}

// get agentprofile page
exports.getagentprofile = (req, res, next) => {
    res.render('admin/agentprofile', {msg:"", err:"" })
}

// post request
exports.postagentprofile = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "SELECT * " +
            "FROM agent" +
            "WHERE Aname = " + mysql.escape(req.body.Aname) +
            "AND email = " + mysql.escape(req.body.email) +
            "AND phone = " + mysql.escape(req.body.phone) +
            "AND password = " + mysql.escape(req.body.password) + 
            "AND address = " + mysql.escape(req.body.address) +
            "AND gender = " + mysql.escape(req.body.gender);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
            else {
                return res.render('admin/agentprofile', {msg: "", err: "", data:result });
            }
    })
}

// get deleteagent page
exports.getdeleteagent = (req, res, next) => {
    res.render('admin/deleteagent', {msg:"", err:"" })
}

// post request
exports.postdeleteagent = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "DELETE FROM agent" +
            "WHERE Aname = " + mysql.escape(req.body.Aname) +
            "AND email = " + mysql.escape(req.body.email) +
            "AND phone = " + mysql.escape(parseInt(req.body.phone)) +
            "AND password = " + mysql.escape(req.body.password) + 
            "AND address = " + mysql.escape(req.body.address) +
            "AND gender = " + mysql.escape(req.body.gender);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
            else {
                return res.render('admin/deleteagent', {msg: "", err: "", data:result });
            }
    })
}

// get editagent page
exports.getediteagent = (req, res, next) => {
    res.render('admin/editagent', {msg:"", err:"" })
}

// post request
exports.posteditagent = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "UPDATE agent " +
        "SET Aname = " + mysql.escape(req.body.Aname) +
        ", email = " + mysql.escape(req.body.email) +
        ", phone = " + mysql.escape(parseInt(req.body.phone)) +
        ", password = " + mysql.escape(req.body.password) +
        ", address = " + mysql.escape(req.body.address) +
        " gender = " + mysql.escape(req.body.gender);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
            else {
                return res.render('admin/editagent', {msg: "", err: "", data:result });
            }
    })
}

// get profile page
exports.getprofile = (req, res, next) => {
    res.render('admin/profile', {msg:"", err:"" })
}

// post request
exports.postprofile = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "SELECT * " +
    "FROM agent" +
    "WHERE Aname = " + mysql.escape(req.body.Aname) +
    "AND email = " + mysql.escape(req.body.email) +
    "AND phone = " + mysql.escape(req.body.phone) +
    "AND password = " + mysql.escape(req.body.password) + 
    "AND address = " + mysql.escape(req.body.address) +
    "AND gender = " + mysql.escape(req.body.gender);

connectDB.query(data, (err, result) => {
if (err) throw err;
    else {
        return res.render('admin/profile', {msg: "", err: "", data:result });
    }
})
}

// get editprofile page
exports.getprofileedit = (req, res, next) => {
    res.render('admin/editagent', {msg:"", err:"" })
}

// post request
exports.postprofileedit = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "UPDATE agent " +
        "SET Aname = " + mysql.escape(req.body.Aname) +
        ", email = " + mysql.escape(req.body.email) +
        ", phone = " + mysql.escape(parseInt(req.body.phone)) +
        ", password = " + mysql.escape(req.body.password) +
        ", address = " + mysql.escape(req.body.address) +
        " gender = " + mysql.escape(req.body.gender);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
            else {
                return res.render('admin/profileedit', {msg: "", err: "", data:result });
            }
    })
}

//get update page
exports.getSearch = (req, res, next) => {
    res.render('admin/search', { msg: "", err: "" })
}

//post request
exports.postSearch = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/update', { msg: "", err: "", data: result });
        }
    })

}

//get update page 

exports.getUpdate = (req, res, next) => {
    // console.log(req.body);
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "SELECT * " +
        "FROM category " +
        "WHERE name = " + mysql.escape(req.body.cat) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND cost = " + mysql.escape(req.body.cost);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            req.session.info = result[0];
            res.render('admin/updatePage', { data: result[0] });
        }
    })
}

//update previous data

exports.updatePrevData = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "password",
        database: "hotel"
    });

    data = "UPDATE category " +
        "SET type = " + mysql.escape(req.body.type) +
        ", cost = " + mysql.escape(parseInt(req.body.cost)) +
        ", available = " + mysql.escape(parseInt(req.body.avlvl)) +
        ", `dec` = " + mysql.escape(req.body.des) +
        " WHERE name = " + mysql.escape(req.session.info.name) +
        " AND type = " + mysql.escape(req.session.info.type) +
        " AND cost = " + mysql.escape(parseInt(req.session.info.cost))

    //  console.log(req.session.info);    
    //  console.log(req.body); 
    //  console.log(data);        

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            res.render('admin/search', { msg: "Update Done Successfuly", err: "" })
        }
    })

}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.render('admin/login', { msg: "", err: "" });
}

