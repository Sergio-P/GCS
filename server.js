/*
		Grouped Clients Server		
		Sergio Peñafiel - 2015
*/

//	Settings
var port = 8555;		// Server Port
var groupMax = 3;		// Max number of users per group
var groupMin = 2;		// Min num of user to start a group
//var rankDelta = -1;		// Max accepted difference in rank to join a group (-1 for no rank)


//	Server
var express = require('express');
//var session = require('express-session');
var qs = require('querystring');
//var pg = require('pg');

var app = module.exports = express();
//var conString = "";

var http = require('http').createServer(app);
var io = require('socket.io')(http);

//app.use(express.static('resources'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
//app.use(session({secret: 'supersecret', saveUninitialized: false, resave: false}));

var groups = [];
var waitUsers = {};
var allUsers = {};

var maxGId = 0;
var freeGId = [];

// EXPRESS
app.get("/",function(req,res){
	res.render("main");
})

// SOCKET IO
io.on("connection",function(socket){

	allUsers[socket.id] = {group: -1};

	socket.on("disconnect", function(){
		var gid = allUsers[socket.id].group;
		delete allUsers[socket.id];
		if(gid==-1){
			delete waitUsers[socket.id];	
		}
		else{
			arrayRemove(groups[gid],socket.id);
			if(groups[gid].length<groupMin){
				emitToGroup(gid,"ungroup",null);
				groups[gid] = [];
				freeGId.push(gid);
			}
			else{
				emitToGroup(gid,"userLeave",null);
				reFindGroups();
			}
		}
	});

	socket.on("find",function(data){
		waitUsers[socket.id] = {rank: (data.rank || -1)};
		reFindGroups();
	});

	socket.on("groupEmit",function(data){
		var gid = allUsers[socket.id].group;
		emitToGroup(gid,data.event,data.params);
	});

});

function reFindGroups(){
	//Find spaces in created groups
	var c = Object.keys(waitUsers).length;
	for(gid in groups){
		while(c>0 && groups[gid].length!=0 &&groups[gid].length<groupMax){
			var sid = Object.keys(waitUsers)[0];
			groups[gid].push(sid);
			allUsers[sid].group = gid;
			c--;
			delete waitUsers[sid];
			io.sockets.connected[sid].emit("group",{group: gid});
		}
	}
	//Create new groups
	var c = Object.keys(waitUsers).length;
	var gid = getFreeGId();
	if(c>=groupMin){
		var arr = [];
		for(sid in waitUsers){
			if(c<=0)
				break;
			else{
				arr.push(sid);
				allUsers[sid].group = gid;
				c--;
			}
		}
		for(val in arr){
			var sid  = arr[val];
			delete waitUsers[sid];
			io.sockets.connected[sid].emit("group",{group: gid});
		}
		groups[gid]=arr;
		if(gid==maxGId)
			maxGId++;
		else
			freeGId.shift();
		console.log("New group id: "+gid);
	}
}

function getFreeGId(){
	if(freeGId.length==0)
		return maxGId;
	else
		return freeGId[0];
}

function arrayRemove(arr, item){
	for(var i = arr.length; i--;) {
		if(arr[i] === item)
			arr.splice(i, 1);
	}
}

function emitToGroup(gid,event,params){
	for(val in groups[gid]){
		var sid = groups[gid][val];
		if(params==null)
			io.sockets.connected[sid].emit(event);
		else
			io.sockets.connected[sid].emit(event,params);
	}
}

http.listen(port,function(){
	console.log('Server started on port '+port+' \n Ctrl + C to shut down');
});
