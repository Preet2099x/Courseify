const app = require('express');
const http = require('http').Server(app);

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://preet2099x:kOZiI8wLq2HvEV2P@test-pro-db.m6pmy.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db')

const User = require('./models/userModel');

async function insert()
{
    await User.create({
        name:'DB Connection',
        status: 'connected'
    })
}

http.listen(3000,function(){
    console.log("Server is running");
});