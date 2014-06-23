// ============ Config ============
var feedURL = "<Feed URL>";
var tracking_keyphrases = ['key phrase 1', 'key phrase 2', 'key phrase 3'];
var minutes = 5;

// SendGrid Config
var api_user = '<SendGrid Username>';
var api_key = '<SendGrid Password>';
var sendToEmail = '<email to send to>';
var sendFromEmail = '<email from>'
var subject = '<email subject>';
// ============ End of Config ============

var	room = "Lobby",
	request = require('request'),
	express = require("express"),
	app = express();
	
var connectedClients = 0;
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var rss = require('parserss');

var sendgrid  = require('sendgrid')(api_user, api_key);
var foundList = "";

var the_interval = minutes * 60 * 1000;

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

var server = require('http').createServer(app);
server.listen(PORT, IPADDRESS);
var io = require('socket.io').listen(server);
io.set('transports', [ 'polling' ]);

io.on('connection', function(socket){
	socket.on('handshake', function(data){
		connect(socket, data);
	});
	socket.on('users', function(msg){
		socket.emit('users', {connectedClients: connectedClients});
	});
  
	socket.on('disconnect', function (data) {
        disconnect(socket, data);
    });
});

function disconnect(socket, data) {
	connectedClients--;
	if (connectedClients < 0) { connectedClients = 0; }
	console.log("A user has disconnected. Connected Users: " + connectedClients + " (" + getDatetime() + ")");
}
function connect(socket, data){
	socket.join(room);
	if (connectedClients < 0) { connectedClients = 0; }
	connectedClients++;
	console.log("A user has connected. Connected Clients: " + connectedClients + " (" + getDatetime() + ")");
	socket.emit('handshake', {connectedClients: connectedClients});
}

function readFeed() {
	rss(feedURL, 10, function (err, res) {
	  parseFeed(res.articles);
	});
}
function parseFeed (feedList) 
{
	var newFoundList = "";
	var foundLinks = [];
	for (var i=0;i<feedList.length;i++) {
		var title = (feedList[i].title).toLowerCase();
		var link = feedList[i].link;
		
		io.sockets.in(room).emit('feed', {title: title, link: link});
		for (var j=0; j < tracking_keyphrases.length; j++) {
			if (title.indexOf(tracking_keyphrases[j]) == -1) continue;
			if (foundLinks.indexOf(link) >=0 ) continue;
			foundLinks.push(link);
			newFoundList += "Title: " + title + " (" + link +  ")<br/><br/>";
		}
		
		if (i==feedList.length-1) {
			if (newFoundList != "") {
				console.log("Found something!");
				console.log(newFoundList);
				if (newFoundList != foundList) {
					sendNotification(newFoundList); 
					foundList = newFoundList;
				}
			} else {
				console.log("[" + getDatetime() + "] Found nothing...");
			}
		}
	}
}

function sendNotification(message) {
	var email     = new sendgrid.Email({
	  to:       sendToEmail,
	  from:     sendFromEmail,
	  subject:  subject,
	  html:     message
	});
	sendgrid.send(email, function(err, json) {
	  if (err) { return console.error(err); }
	  console.log(json);
	});
}

function getDatetime() {
	var currentdate = new Date();
	var datetime = currentdate.getDate() + "/"
					+ (currentdate.getMonth()+1)  + "/" 
					+ currentdate.getFullYear() + " @ "  
					+ currentdate.getHours() + ":"  
					+ currentdate.getMinutes() + ":" 
					+ currentdate.getSeconds();
	return datetime;
}

setInterval(function() {
  console.log("[" + getDatetime() + "] Checking Feed...");
  readFeed();
}, the_interval);