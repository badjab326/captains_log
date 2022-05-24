// Dependencies
const express = require('express');
const app = express();
require('dotenv').config();
const { default: mongoose } = require("mongoose");
const Log = require('./models/logs');

// Database Connection
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

// Routes
// New
app.get('/logs/new', (req, res) => {
    res.render('new.ejs')
})

// Create
app.post('/logs', (req, res) => {
    if (req.body.shipIsBroken === 'on') {
		//if checked, req.body.shipIsBroken is set to 'on'
		req.body.shipIsBroken = true;
	} else {
		//if not checked, req.body.shipIsBroken is undefined
		req.body.shipIsBroken = false;
	}

    Log.create(req.body, (error, createdLog) => {
        res.redirect('/logs')
    })
});

// Index
app.get('/logs', (req, res) => {
	Log.find({}, (error, allLogs) => {
		res.render('index.ejs', {
			logs: allLogs,
		});
	});
});


// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));