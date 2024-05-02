
const express = require('express');
const { insertUser,userExists } = require('./database');


function handleSignup(req,res){
    const {username,password,firstname,lastname,addressline,addressline2,city,state,zip } = req.body; // Assuming username and password are sent in the request body
    if (!username || !password || !firstname || !lastname || !addressline || !city || !state || !zip) {
        return res.render('signup', { error: 'All fields are required' });
    }
    userExists(username, (err, exists) => {
        if(err){
            console.error('error checking user', err);
        }
       
        else if(exists) {
            res.render('signup',{ error: 'Username is already taken' }); // Send JSON response indicating that the username is taken
        } 
        //Checks if password is valid 
        else if(password.includes(" ")){
            res.render('signup',{error:'Password is invalid because it has a space in it'});
                
        }
            
        //Checking to see if the address are valid
        else if(!(addressline.includes("street"))  && !(addressline.includes("avenve")) && !(addressline.includes("lane")) && !(addressline.includes("place"))){
            res.render('signup',{error:'Address 1 is not valid because it does not include a street, avenve, lane, or place'});   
        }

        else if(!(addressline2.includes("null"))){
            res.render('signup',{error:'Address 2 is not valid because it is not null'});
        }

        else{
            insertUser(username,password,firstname,lastname,addressline, addressline2, city,state,zip, (err,userId) => {
                if (err){
                    console.error('Error inserting: user', err);
                }
                else{
                    console.log('User inserted with ID:', userId);
                    res.render('home',{isLoggedIn:true,username:username, admin:false});
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



module.exports = {handleSignup};
