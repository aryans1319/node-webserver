const { nextDay } = require('date-fns');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger

/* 
Method 1
app.use((req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t{req.url}`, 'reqLog.txt')
    console.log(`${req.method} ${req.path}`);
    next();
});
*/
// To make it more clean - Method 2
// copy function create it into the log events and export it
app.use(logger)

// Third party Middleware - CORS(Cross origin resource sharing)
const whitelist = ['https://www.google.com', 'https://127.0.0.1:5500', 'https://localhost:3500'];
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1|| !origin){
            callback(null, true)
        } else{
            callback(new Error('Not Allowed by CORS'))
        }
    }, 
    optionSuccessStatus : 200
}
app.use(cors(corsOption));

/*
built in middle-ware to handle url encoded data
in other words, form data : 
'content-type: application/x-www-form-urlencoded'
*/
app.use(express.urlencoded({ extended: false }));


// built-in middleware for JSON
app.use(express.json())

// serve static files
// it will search the public repo before sending any req
app.use(express.static(path.join(__dirname, '/public')));

//if we don't use it here css wont work in /subdir
app.use('/subdir', express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

// Adding an Express Route
/*
applying regex to express routes 
if we put .html inside brackets then we don't need to specify /index.html
.html extension to load data we can do that simply by /index without ext
Making .html optional in the request
*/



// app.all - means for all http methods
// app.all('*') works same
app.all('*', (req, res) => {
    // This would not show 404 as we already created a file for it to check, it would get response
    // set status code to 404 
    // res.sendFile(path.join(__dirname, 'views', '404.html'));

    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error : "404 Not Found"});
    } else{
        res.type('txt').send("404 Not Found");
    }
    
}); 

// Creating a custom error handler
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

