const { nextDay } = require('date-fns');
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500;

// Adding an Express Route
// app.get('/', (req, res) => {
//     // res.sendFile('./views/index.html', {root : __dirname});
//     res.sendFile(path.join(__dirname, 'views', 'index.html'));
// });
// app.get('/new-page.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
// });

/*
applying regex to express routes 
if we put .html inside brackets then we don't need to specify /index.html
.html extension to load data we can do that simply by /index without ext
Making .html optional in the request
*/
app.get('/index(.html)?', (req, res) => {
    // res.sendFile('./views/index.html', {root : __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); // 302 by default but we changed it to 301
});


// Route Handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next()
}, (req, res) => {
    res.send('Hello World');
})

// Chaining Route Handlers - work in way similar to middleware
const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res, event) => {
    console.log('three');
    res.send('Finished');
}

// passed handler in an array
app.get('/chain(.html)?', [one, two, three]);


app.get('/*', (req, res) => {
    // This would not show 404 as we already created a file for it to check, it would get response
    // set status code to 404 
    // res.sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
}); 





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

