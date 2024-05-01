var mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});
connection.connect((err => {
  if (err) throw err;
  console.log('MySQL Connected');
}));

function userExists(username, callback) {
  let sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results.length > 0);
  });
}

//
function passwordCheck(username, password, callback) {
  let sql = 'SELECT * FROM users WHERE username = ? AND keypass = ?';
  connection.query(sql, [username, password], (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results.length > 0);
  });
}

function insertUser(username,password,first_name,last_name,address_1, address_2, city,state,zip, callback){
  let sql = 'INSERT INTO users (username,keypass,first_name,last_name,street,apt_num,city,state,zip,admin_perms) VALUES (?,?,?,?,?,?,?,?,?,FALSE)';
  connection.query(sql,[username,password,first_name,last_name,address_1,address_2,city,state,zip], (err,result) =>{
    if (err){
      return callback(err);
    }
    callback(null,result.insertId);
  });
}


function isAdmin(username,callback){
  let sql = 'SELECT * FROM users WHERE username = ? AND admin_perms = 1';
  connection.query(sql, [username], (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results.length > 0);
  });

}

//function to insert to cart
//takes in a username,product_id, inventory type

function addToCart(username,productName, inventoryType,price,callback){

  let sql = 'INSERT INTO USER_CART (username,prod_name,inventory_type,quantity,price) VALUES (?,?,?,1,?)';
  connection.query(sql, [username,productName,inventoryType,price],(err,result) =>{
    if (err){
      return callback(err);
    }
    callback(null,result.insertId);
  });
}



async function createOrder(username, subtotal, callback) {
  try {
    // Calculate total with tax
    const total = subtotal * 1.0825;
    
    // Insert order into ORDERS table
    const orderInsertResult = await insertOrder(username, total);
    const orderNum = orderInsertResult.insertId;
    
    // Add items to the order
    await addItemsToOrder(username, orderNum);
    
    // Reduce available quantity of items
    await updateAvailableItemQuantities(username);

    // Remove items from the user's cart
    await removeFromCartItems(username);

    

    console.log('Order created successfully');
    callback(null, orderNum);
  } catch (err) {
    console.error('Error creating order:', err);
    callback(err);
  }
}

async function insertOrder(username, total) {
  const sql = 'INSERT INTO ORDERS (username, total) VALUES (?, ?)';
  return await query(sql, [username, total]);
}

async function updateAvailableItemQuantities(username) {
  const sqlSelectCart = 'SELECT prod_name, quantity FROM user_cart WHERE username = ?';
  const sqlSelectInventory = 'SELECT quantity FROM fish_inventory WHERE fish_name = ?';
  const sqlUpdate = 'UPDATE fish_inventory SET quantity = ? WHERE fish_name = ?';

  const items = await query(sqlSelectCart, [username]);

  for (const item of items) {
    const name = item.prod_name;
    const inventory = await query(sqlSelectInventory, [name]);
    if(inventory.length > 0) {
      const newQuantity = inventory[0].quantity - item.quantity;
      await query(sqlUpdate, [newQuantity, name]);
    }
  }
}

async function addItemsToOrder(username, orderNum) {
  const sqlSelect = 'SELECT prod_name, inventory_type, quantity FROM user_cart WHERE username = ?';
  const sqlInsert = 'INSERT INTO items_in_order (order_id, prod_name, inventory_type, quantity) VALUES (?, ?, ?, ?)';
  const items = await query(sqlSelect, [username]);

  for (const item of items) {
    await query(sqlInsert, [orderNum, item.prod_name, item.inventory_type, item.quantity]);
  }
}

async function removeFromCartItems(username) {
  const sql = 'DELETE FROM user_cart WHERE username = ?';
  return await query(sql, [username]);
}

async function query(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}



///adding delete / add products for admin
function fishExists(fish_name, callback) {
  let sql = 'SELECT * FROM fish_inventory WHERE fish_name = ?';
  connection.query(sql, [fish_name], (err, results) => {
      if (err) {
          return callback(err);
      }
      callback(null, results.length > 0);
  });
}

function insertFish(fish_name,price,image,description,quantity,callback){
  let sql = 'INSERT INTO fish_inventory (fish_name,price,in_stock,image,description,quantity) VALUES (?,?,TRUE,?,?,?)';
  connection.query(sql,[fish_name,price,image,description,quantity], (err,result) =>{
    if (err){
      return callback(err);
    }
    console.log('this is the image',image);
    callback(null,result.insertId);
  });
}

function removeFish(fish_name, callback) {
  let sql = 'DELETE FROM fish_inventory WHERE fish_name = ?';
  connection.query(sql,[fish_name],(err,result) =>{
    if(err){
      return callback(err);
    }
    callback(null,result);

  });
}


function addAudit(action,fish_name,admin,callback ){
  let sql = 'INSERT into audit (operation,product,admin_user) values (?,?,?)';
  connection.query(sql,[action,fish_name,admin], (err,result) =>{
    if(err){
      return callback(err);
    }
    console.log('added to audit trail');
    callback(null,result.insertId);
  });


}



//////

module.exports = {
  userExists,passwordCheck,insertUser,isAdmin,addToCart,createOrder,fishExists, insertFish,removeFish,addAudit,
  databaseConnection: connection
};