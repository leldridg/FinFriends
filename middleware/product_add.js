const express = require('express');
const { insertFish,fishExists } = require('./database');




function handleStocking(req,res){
    const {fish_id,fish_name,price,in_stock} = req.body; // Assuming username and password are sent in the request body

    fishExists(fish_name, (err, exists) => { //fish exists is not a function
        if(err){
            console.error('error checking fish', err);
        }
        if(exists) {
            res.status(400).json({ error: 'Fish is already there' }); // Send JSON response indicating that the username is taken
        } else{
            insertFish(fish_id,fish_name,price,in_stock, (err,userId) => {
                if (err){
                    console.error('Error inserting: fish', err);
                }
                else{
                    console.log('Fish inserted with ID:', fish_id);
                    res.render('listing');
                }
            });
        
        }
    });

/*
    insertUser(username,password,firstname,lastname,addressline, addressline2, city,state,zip, (err,userId) => {
        if (err){
            console.error('Error inserting: user', err);
        }
        else{
            console.log('User inserted with ID:', userId);
            res.render('home');
        }
    });*/


}



module.exports = {handleStocking};

