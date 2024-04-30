
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
       
        if(exists) {
            res.status(400).json({ error: 'Username is already taken' }); // Send JSON response indicating that the username is taken
        } else{
            //Checks if password is valid (right now without a query)
            //It is working
            if(password.includes(" ")){
                res.status(400).json({error:'Password has a space in it'});
            }
            
            //Checking to see if the address are valid(right now without a query)
            if(!(addressline.includes("street")) && !(addressline.includes("st")) && !(addressline.includes("avenve")) && 
            !(addressline.includes("ave")) && !(addressline.includes("lane")) && !(addressline.includes("place")) 
            && !(addressline.includes("blvd")) && !(addressline.includes("boulvard"))){
                res.status(400).json({error:'Address is not valid because it does not include a street/st, ave/avenve, lane, boulvard/blvd or place'});
            }

            if(!(addressline2.includes("null"))){
                res.status(400).json({error:'Address is not valid because it is not null'});
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
