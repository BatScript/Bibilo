//INT 221 Final Project

// Import the functions you need from the SDKs you need
const initializeApp = require("firebase/app");
const getAnalytics = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var dotenv = require('dotenv').config();
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const express = require('express'); // we started with express to use http verbs and view engine(ejs)
const router= express();

router.use(express.static(__dirname + '/Public')); // This will help us to fetch static files like images ans styles

router.set('view engine', 'ejs'); //With this we are initiating our Template engine and we can use it in our driver file now.

// They will help us with form data reading after user submits it
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({
    extended: true
}));

//Mongoose will help us to write shorter version of mongodb code snippets
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bibilo:' + process.env.MONGO_PASSWORD + '@cluster0.9mefx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connect('mongodb://localhost:27017/test');

//passportjs extensions:
const passport = require('passport'); // Authenticator extension
const session = require('express-session'); // Session ID is saved in cookie using this
const passportLocalMongoose = require('passport-local-mongoose'); //simplifies login/signup with mongoose
const { Router } = require("express");

const userDataSchema = new mongoose.Schema({
    email: String,
    username: String,
    cartItems: [{
        name: String,
        qty: {
            type: Number,
            default: 0,
            min: [0, 'Cant delete more']
        }
    }]
})

const userData = mongoose.model('userData', userDataSchema);

const products = new mongoose.Schema({
    image: String,
    name: String,
    author: String,
    rating: Number,
    price: Number
})


const productData = mongoose.model('productData', products);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
})

userSchema.plugin(passportLocalMongoose);

const userCredentials = mongoose.model('userCredentials', userSchema);

// Cookie initialised
router.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false
}));

//Passport initialization with session
router.use(passport.initialize());
router.use(passport.session());


// A model (a folder basically) where we store our data in the database

// To Configure our mkongoDB credentials with passport authentication
// Taken from passport-local-mongoose npm page
passport.use(userCredentials.createStrategy());

//uses the session to fetch the user data and stores as an ID in the cookie
passport.serializeUser(userCredentials.serializeUser());

// Reads teh user ID and authenticates them to proceed
passport.deserializeUser(userCredentials.deserializeUser());



//login route handle


//signup route handle
router.get("/signup", (req, res) => {
    res.render("signup", {
        message: ""
    });
})

//landing route with authorization check
router.get("/landing", (req, res) => {

    productData.find({}, (err, foundItems) => {

        const books = foundItems;
        if (req.isAuthenticated()) {
            const name = req.user.username;

            userData.findOne({
                email: name
            }, (err, foundItem) => {
                const cartLength = foundItem.cartItems.length
                const userDisplayName = foundItem.username;
                res.render("landing", {
                    name: userDisplayName,
                    products: books, 
                    length: cartLength
                });
            })

        } else {
            res.render("login", {
                message: "you need to log in first"
            });
        }

    });
});

//logout with session end
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/cart", (req, res) => {
    if (req.isAuthenticated()) {
        const findcartdata = req.user.username;

        userData.findOne({
            email: findcartdata
        }, async function (err, BookId) {
            // console.log(BookId.cartItemId);

            const idArray = BookId.cartItems;
            var bookArray = [];
            for (const data of idArray) {
                const foundBookData = await productData.findOne({
                    _id: data.name
                }).catch(console.error);
                if (!foundBookData) {
                    continue
                };

                bookArray.push(foundBookData);

                var f = BookId.cartItems;
                var s1 = bookArray.length;
                var s2 = f.length;
                var sum = 0;
                for(i = 0 ; i < s1; i++){
                    sum += bookArray[i].price * f[i].qty;
                }
            }

            res.render("cart", {
                s1: s1,
                s2: s2,
                cartBookArray: bookArray,
                cartQty: f,
                total: sum
            })
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/cart/:id", (req, res) =>{
    const id = req.params.id;
    const change = req.body.indec;
    const usermail = req.user.username;
    userData.findOne({email: usermail}, (err, changeval) => {
        if(change == "decrement"){
                changeval.cartItems.find(val => val.name === id).qty-=1;
                changeval.save();
        }
        if(change == "increment"){
            changeval.cartItems.find(val => val.name === id).qty+=1;
            changeval.save();
    }
    })
    res.redirect("/cart");
})

router.get('/adminpanel', (req, res) => {

    productData.find((err, booklist) => {


        if (req.isAuthenticated() && req.user.isAdmin) {
            res.render("admin", {
                bookList: booklist
            });
        } else {
            res.redirect('login')
        }
    });
});

router.post('/addtocart/:id', (req, res) => {
    const bookid = req.params.id;

    if (req.isAuthenticated()) {
        const currentusername = req.user.username;
        userData.findOne({
            email: currentusername
        }, async (err, foundStuff) => {
            var kaamKaArray = foundStuff.cartItems;
            if (err) {
                console.log(err);
            } else {
                var shortCut = kaamKaArray.find(val => val.name === bookid)
                if (shortCut) {
                    shortCut.qty += 1
                    foundStuff.save();
                } else {
                    var data = {
                        name: bookid,
                        qty: 1
                    };
                    kaamKaArray.push(data);
                    foundStuff.save();
                }
            }
            res.redirect('/cart');
        });
    } else {
        res.redirect("/cart");
    }
})

router.post('/adminpanel', (req, res) => {
    const newBook = new productData({
        image: req.body.imagelink,
        name: req.body.bookname,
        author: req.body.author,
        rating: req.body.rating,
        price: req.body.price
    });

    newBook.save();
    res.redirect('/adminpanel')
})

router.post('/delete', (req, res) => {
    const checkedItem = req.body.checkbox;
    productData.findByIdAndRemove(checkedItem, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/adminpanel")
        }
    })
})

//Signup post method with registering the credientials in db using passport
router.post('/signup', (req, res) => {

    var a = req.body.password;
    var b = req.body.cpassword;

    if (a != b) {
        res.render("signup", {
            message: "Passwords do not match"
        });
        return false;
    }

    // saves the email and name in another DB schema which contains personal info of 
    // user
    const human = new userData({
        email: req.body.username,
        username: req.body.name
    });

    human.save();

    userCredentials.register({
        username: req.body.username,
        isAdmin: false
    }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect('/signup');
        } else {
            passport.authenticate("local")(req, res, (err, user, info) => {
                res.redirect("/landing");
            });
        }
    });
});

router.get("/login", (req, res) => {
    res.render("login", {
        message: ""
    });
})

router.post('/login', (req, res) => {
    userCredentials.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if (foundUser) {
            const user = new userCredentials({
                username: req.body.username,
                password: req.body.password
            });
            passport.authenticate("local", function (err, user) {
                if (err) {
                    console.log(err);
                } else {
                    if (user) {

                        req.login(user, function (err) {
                            res.redirect("/landing");
                        });
                    } else {
                        res.render("login", {
                            message: "Error"
                        });
                    }
                }
            })(req, res);
        } else {
            res.render("login", {
                message: "Error"
            })
        }
    });
})

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/landing')
    }
    else{
        res.render('login', {
            message: ""
        });
    }
});

router.post('/adminpanel/editlists/:item', (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        
        productData.findOne({
            _id: req.params.item
        }, (err, foundListings) => {
            res.render("edit.ejs", {
                book: foundListings
            });
        })
    }
})

router.post('/adminpanel/edited/:id', (req,res) => {
    if(req.isAuthenticated() && req.user.isAdmin){
        var data ={
            image: req.body.image,
            title: req.body.title,
            author: req.body.author,
            rating: req.body.rating,
            price: req.body.price,
            id: req.params.id
        }

        productData.findOne({_id: data.id}, (err, updateData) => {
            updateData.image = data.image;
            updateData.name = data.title;
            updateData.author = data.author;
            updateData.rating = data.rating;
            updateData.price = data.price;
            updateData.save();
        });

        res.redirect('/landing');
    }
})

router.get('*', function(req, res){
    res.render("notfound");
  });

//Listens to my requests and implement responses on server with the given port no.
router.listen(process.env.PORT || 3000, () => {
    console.log("started at 3000");
});