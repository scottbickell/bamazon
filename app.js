var mysql = require("mysql");
var inquirer = require("inquirer");
var nodemon = require("nodemon");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("mysql connection successful");
    // start();
  });