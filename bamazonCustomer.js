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

connection.connect(function (err) {
    if (err) throw err;
    // console.log("mysql connection successful");
    displayAll();
});

// Display the ids, names, and prices of all available products for sale
function displayAll() {
    var query = "SELECT * FROM products GROUP BY item_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: $" + res[i].price);
        }
        userSelection();
    });
}

function userSelection() {
    inquirer
        .prompt([{
            name: "item_id",
            type: "input",
            message: "Please enter the Item ID of the product you would like to purchase."
        }, {
            name: "quantity",
            type: "input",
            message: "Enter the quantity you would like to purchase."
        }])
        .then(function (answer) {
            var item = answer.item_id;
            var quantity = answer.quantity;
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, {item_id: item}, function (err, res) {
                if (err) throw err;
                console.log("You chose item_id: " + item + " and a quantity of: " + quantity);
                var itemDetails = res[0];
                // show the item details
                // console.log(JSON.stringify(itemDetails));
                // console.log(itemDetails.stock_quantity);
                if (quantity <= itemDetails.stock_quantity) {
                    console.log("Order successful. Number of requested items is in stock. " + (itemDetails.stock_quantity));
                    // update database quantity
                    var updatedStockQuantity = (itemDetails.stock_quantity - quantity);
                    console.log("Updated stock quantity: " + updatedStockQuantity);
                    var updateQuery = "UPDATE products SET stock_quantity = " + updatedStockQuantity + " WHERE item_id = " + item;
                    // console.log(updateQuery);
                    // send query to mysql
                    connection.query(updateQuery, function(err, res) {
                        if (err) throw err;
                        console.log("Update successful. New quantity is: " + updatedStockQuantity + " Previous quantity was: " + (itemDetails.stock_quantity));
                    })
                } else {
                    console.log("Sorry, we don't have that quantity in stock");
                    displayAll();
                }
            })

        })
}