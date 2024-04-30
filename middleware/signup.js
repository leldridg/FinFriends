
const express = require('express');
const { insertUser,userExists,invalidPassword } = require('./database');


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
            invalidPassword(password,(err,isValid) => {
                if(err){
                    console.error('error checking password',err)
                }

                if(!(isValid)){
                    if(password.includes(" ")){
                        res.status(400).json({
                          error: 'Password is invalid because it has a space in it'});
                    }
                    else{
                        res.status(400).json({error: 'Password is invalid' });
                    }
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
