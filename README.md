

<h1>Introduction</h1>
I have created a type of e-commerce website which has a variety of books that we can add to the cart, change quantity add then check out. This website also has an admin corner where a user with admin rights can add and modify the books present in the database. To create this web application I have used Express js, Node js, and MongoDB. I have also used modules like passport js, mongoose, and many more to make my programming experience better as well as to add additional features. I have created this application for the duration of a month and I took the help of several websites and documentations like StackOverflow, w3schools, and many like them. The version I am going to explain is very initial and I have thought of a lot of upgrades to execute on this as an e-commerce website is a window for us developers to show our skills and creativity. I have plans to add a chatbot, Newsletter service, and a payment gateway as well.
Web-Map



<h1>MongoDB</h1>

This is the GUI of MongoDB which is called MongoDB compass. Here we can see three schemas inside test collection and on right side there’s JSON format of data inside productData schema which contains books.
Here’s how we initiate the schemas so that we can put data inside the collections in same format. userData schema has email, username and cartItems array which will store all of the items ussr puts inside a cart. Quantity field also has a validation with lower limit which returns given message if user tries to insert values inside 0 in qty field. 
Product schema has all the fields related to books and most important collection which will help us in identify user as well as their admin rights is userschema.
Interface-Login/Sign-Up
Login page is a mobile responsive interface with a form in a flex-box with an image on the left. The user needs to enter all the details in the form in order to access the homepage of the website. Both login and the sign-up pages are associated with passport-js which manages the session of users once they log in. We also have a package called passport-local-mongoose to take care of user credentials so that password entered by the user is properly hashed and salted for security. It also compares the passwords when they log in again with the same credentials. After storing the data, passport-js initializes a session in the cookie.
For web layouts, we used ejs as a templating engine.



<h1>Interface-Home</h1>

The user interface for the homepage is a simple card-based design with several books below the bootstrap navbar which defines the beginning of a new division. The navbar has several genres of books. Before the navbar, we have a bootstrap carousel that moves on its own and can be navigated via buttons as well.  
Templating helps a lot when we need to create some frame that is constantly repeated and yet the data inside it remains dynamic. Here I have used ejs to run a for loop to display several books inside their division as flex-boxes. In each flex-box, we have a book image, its name, author’s name, rating, and price all of them fetched from the database using mongoose.


I have used forEach to loop through all elements of the book array that I passed when I rendered the home page.
This is the route for a landing page where we use the find method to fetch all the data in collection and then we check if a user is authenticated. Then we render the page with all the info that we fetched in the collection “productData”. This collection has all the list of books that we need to render on landing page. Since we have added authentication here, no user will be able to fetch this page without logging in.
We also have the add button to add an item to the cart. The add button is inside the form which uses post method and sends us to a route with id of the current book. When we rendered page with several books, we assigned each button with its respective IDs. Those IDs are used to identify the book and then add them to cart with initial quantity 1.
Here is the post request where we grab the id of that particular book which we got from the button inside the form we discussed earlier. Now, I created the object with name as the id we fetchd and quantity as 1. The object is now to be pushed to the cartItemarray that I created while initialising the userdata schema. This is how I created add-to-cart feature.
After all this user gets redirected to cart page. Which means on clicking add button, user gets to cart.
Until now we have understood how a user logs in and how they add a book to a cart. Now before we move to cart lets understand logout and other small things.

Logout basically gets the cookie and deletes the session so that our program knows that the user is no more available and since we have authentication checks on almost every route, user is sent back to login with a message, “you need to log in first. 



<h1>Interface-Cart</h1>

The user interface of the cart it has a feature to add and remove the products as well as to increase and decrease the quantity of it. Besides each item, we get their overall price according to their quantity and finally we get the overall price.
Here is the code for the cart route. Things are a bit complex here because first, we get the cart-items which has product id and quantity. Then we find book details using that id and put it in the left side of interface. After this we get quantity of books to post them in the right along with calculated prices. After this we have two buttons for incrementing and decrementing. The post request of those increments and decrements work in a similar way as the add to cart button.



<h1>Interface-Admin</h1>

The admin panel. Admin right is given to a user directly from mongodb cli or gui because its more secure that way. Here we can see full CRUD operations in action. A user can add a new book and delete and edit existing books. 
Here is the adminpanel post route for adding a new book. Its a simple method, just grabbing user inputs, make them objects and push them inside the pre existing schema.



delete post route, which is triggered by clicking on checkbox to delete the item, we first search and then remove using pre-existing mongoose function as shown here. 

<h1>Conclusion</h1>
In this project I learned and practiced various npm modules like passportjs, mongoosejs, dotenv and many more, and understood their significance in several scenarios. I came to know about several advantages as well as limitations of node and expressjs. I have created this project as an assignment for the subject of INT 222 instructed by Ms. Priya Virdi


Github: https://github.com/CodeBinge21/Bibilo
Hosted: https://bibilo.herokuapp.com/





