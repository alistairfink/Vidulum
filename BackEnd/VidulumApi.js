//Config
let config = require('./config');

//Other Config Stuff - Third Party Stuff
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

//DB Connection
let url = config.mongoServer;
let MongoClient = require('mongodb').MongoClient;
let mongo = require('mongodb');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

let port = process.env.Port || 8080;
let router = express.Router();
let apiKey = config.apiKey;
let dbName = config.dbName;
let collections = {
	accounts: 'Accounts'
};

let keccak256 = require('js-sha3').keccak256;
let WAValidator = require('wallet-address-validator');
let nodemailer = require('nodemailer');
let crypto = require('crypto');

const https = require("https");

MongoClient.connect(url, function(err, database) {
	//Check DB Connection
	if(!err) 
		console.log('connected');
	let db = database.db(dbName);

	//Validate Address
	router.route('/validate')
		.post(function(req, res){
			let coin = req.body.coin;
			if(coin) coin = coin.toLowerCase();
			let originalAddress = req.body.address;
			if(originalAddress) originalAddress = originalAddress.trim();
			let address = originalAddress;
			let valid = false;
			if(coin === 'ethereum')
				if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) 
					{	                		
						valid = false;
      		} 
      		else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) 
      		{
        		valid = true;
      		} 
      		else 
      		{
        		address = address.replace('0x','');
        		let addressHash = keccak256(address.toLowerCase());
        		for (var i = 0; i < 40; i++ ) {
          		if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) 
          		{
            		valid = false;
          		}
        		}
        		valid = true;
        	}
			else if(coin === 'bitcoin')
				valid = WAValidator.validate(address, coin);	
			else
				valid =  null;
			res.json({
				coin: coin,
				address: originalAddress,
				valid: valid
			});
		});
	//Backup Wallets
	router.route('/backup')
		.post(function(req, res){
			let _key = req.body.apiKey;
			if(_key === apiKey)
			{
				let _tok = req.body.key;
				let _email = req.body.email;
				db.collection(collections.accounts).find({email: _email}).toArray(function(err, result) {
					if(result.length === 1)
					{
						if(result[0].key === _tok)
						{
							crypto.randomBytes(48, function(err, buff) {
                  let nToken = buff.toString('hex');
                  let id = new mongo.ObjectID(result[0]._id);
                  db.collection(collections.accounts).updateOne({_id: id}, {$set: {key: nToken, wallets: req.body.wallets}});
                res.json({message: 'success', token: nToken});
              });
						} 
						else 
							res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
					} 
					else 
						res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
				});
			} 
			else 
				res.json({error: 'Api Key Not Valid'});
		});
	//Restore Wallets
	router.route('/restore')
		.post(function(req, res){
			let _key = req.body.apiKey;
			if(_key === apiKey)
			{
				let _email = req.body.email;
				let _tok = req.body.key;
				db.collection(collections.accounts).find({email: _email}).toArray(function(err, result) {
					if(result.length === 1)
					{
						if(result[0].key === _tok)
						{
							crypto.randomBytes(48, function(err, buff) {
              	let nToken = buff.toString('hex');
                let id = new mongo.ObjectID(result[0]._id);
                db.collection(collections.accounts).updateOne({_id: id}, {$set: {key: nToken}});
                res.json({wallets: result[0].wallets, token: nToken});
            	});
						} 
						else 
							res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
					}
					else 
						res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
				});
			} 
			else 
				res.json({error: 'Api Key Not Valid'});
		});
	//EtherScan Passthrough
	router.route('/etherscan')
		.post(function(req, res){
			let passThrough = req.body.passThrough;
			let apiKey = config.etherScan;
			let response = null;
			let url = 'https:\/\/api.etherscan.io/api?'+passThrough+'&apikey=' + apiKey;
			https.get(url, _res => {
				_res.setEncoding("utf8");
				let body = "";
				_res.on("data", data => {
					body += data;
				});
				_res.on("end", () => {
					body = JSON.parse(body);
					let response = body;
					res.json(response);
				});
			});
		});
	//Ethplorer Passthrough
	router.route('/ethplorer')
		.post(function(req, res) {
			let passThrough = req.body.passThrough;
			let options = req.body.options ? '&'+req.body.options : '';
			let apiKey = config.ethplorer;
			let url = 'https:\/\/api.ethplorer.io/' + passThrough + '?apiKey=' + apiKey+options;
			https.get(url, _res => {
				_res.setEncoding("utf8");
				let body = "";
				_res.on("data", data => {
					body += data;
				});
				_res.on("end", () => {
					body = JSON.parse(body);
					res.json(body);
				});
			});
		});
	//Feedback Backend
	router.route('/feedback')
		.post(function(req, res) {
			let _apiKey = config.gmailApiKey;
			let userKey = req.body.apiKey;
			if(_apiKey === userKey)
			{
				let transporter = nodemailer.createTransport({
    			service: 'Gmail',
    			auth: {
      			user: config.gmailEmailFrom,
     				pass: config.gmailPass
   				}
				});
				let message = req.body.message;
				if(req.body.returnBool){
					message = message + '\nRespond To: ' + req.body.returnAddr;
				}
				let mailParams = {
					from: config.gmailEmailFrom,
					to: config.gmailEmailTo,
					subject: 'Vidulum - ' + req.body.subject,
					text: message
				};
				transporter.sendMail(mailParams, function(error, info){
					if(error){
						console.log(error);
						res.json({message: 'error'});
					}
					else{
						res.json({message: 'success'});
					}
				});
			}
		});
	//Sign Up
	router.route('/signUp')
		.post(function(req, res) {
			let _key = req.body.apiKey;
			if(_key === apiKey)
			{
				let email = req.body.email;
				email = email.toLowerCase();
				let tester = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				if(tester.test(email))
				{
					db.collection(collections.accounts).find({email: email}).toArray(function(err, result) {
						if(result.length === 0)
						{
							crypto.randomBytes(48, function(err, buff) {
								let token = buff.toString('hex');
								let tempObj = {
									email: email,
									pass: req.body.pass,
									wallets: [],
									key: token
								};
								db.collection(collections.accounts).insertOne(tempObj, function(err, resp) {
									if (err) throw err;
									res.json({token: token});
								});
							});
						}
						else 
							res.json({error: 'E-mail Already in Use'});
					});
				}
				else 
					res.json({error: 'E-mail Invalid'});
			}
			else 
				res.json({error: 'Api Key Not Valid'});
		});
	//Sign In
	router.route('/signIn')
		.post(function(req, res) {
			let _key = req.body.apiKey;
			if(_key === apiKey)
			{
				let email = req.body.email;
				email = email.toLowerCase();
       		db.collection(collections.accounts).find({email: email}).toArray(function(err, result) {
		      if(result.length === 1)
		      {
  	        let _pass = req.body.pass;
            if(_pass === result[0].pass)
            {
							crypto.randomBytes(48, function(err, buff) {
							let id = new mongo.ObjectID(result[0]._id);
							let nToken = buff.toString('hex');
							db.collection(collections.accounts).updateOne({_id: id}, {$set: { key: nToken }});
								res.json({token: nToken});
	        		});
						} 
						else 
							res.json({error: 'E-mail or Password Incorrect'});
        	} 
        	else 
        		res.json({error: 'E-mail or Password Incorrect'});
      	});
			} 
			else 
				res.json({error: 'Api Key Not Valid'});
		});
	//Sign Out
	router.route('/signOut')
		.post(function(req, res) {
			let _key = req.body.apiKey;
			if(_key === apiKey)
			{
				let _email = req.body.email;
				let _tok = req.body.key;
				db.collection(collections.accounts).find({email: _email}).toArray(function(err, result) {
					if(result.length === 1)
					{
						if(result[0].key === _tok)
						{
							crypto.randomBytes(48, function(err, buff) {
								let nToken = buff.toString('hex');
                let id = new mongo.ObjectID(result[0]._id);
								db.collection(collections.accounts).updateOne({_id: id}, {$set: {key: nToken}});
								res.json({message: 'success'});
							});
						} 
						else 
							res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
					} 
					else 
						res.json({error: 'Something Went Wrong. Try Signing Out and Signing Back In'});
				});
			} 
			else 
				res.json({error: 'Api Key Not Valid'});
		});
	app.use('/', router);
	app.listen(port);
});