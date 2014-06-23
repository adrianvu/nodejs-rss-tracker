var socket, threadList = $("#terminal"), cursorBlink, streamming = true, animationMode = "slow";

function toggleStream() {
	if(streamming) {
		streamming = false;
	}
	else {
		streamming = true;
	}
}

function a(e) {
	if (e.keyCode == "8") {
		e.preventDefault();
		var s = $("#command").val();
		s = s.substring(0, s.length - 1);
		$("#command").val(s);
		$(".text-input").html(s + '<span class="cursor">&nbsp;</span>');
		
	}
}
function g(e) {
	if (e.keyCode == "13") {
		var command = $("#command").val();
		parseCommand(command);
		$("#command").val("");
		
	} else if (e.keyCode >= 48 && e.keyCode <= 90){
		var character = String.fromCharCode(e.keyCode).toLowerCase();
		var commandStr = $("#command").val() + character;
		if ($("#command").is(":focus")) {
			
		} else {
			$("#command").val(commandStr);
		}
		
	} else if (e.keyCode == "32") {
		var commandStr = $("#command").val() + " ";
		if ($("#command").is(":focus")) {
			
		} else {
			$("#command").val(commandStr);
		}
	}
	$(".text-input").html($("#command").val() + '<span class="cursor">&nbsp;</span>');
}
function parseCommand(command) {
	socket.emit('commands', {command: command});
	var command = command.split(" ");
	switch(command[0]) {
		case "pause": toggleStream();
		break;
		case "resume": toggleStream();
		break;
		case "color": changeFontColor(command[1]);
		break;
		case "auto": toggleAutoScroll(command[1]);
		break;
		case "help": $("#helpModal").modal('show');
		break;
		case "clear": clearTerminal();
		break;
		case "about": $("#aboutModal").modal('show');
		break;
		case "users": socket.emit('users');
		break;
	}
}

function clearTerminal() {
	threadList.empty();
}
function toggleAutoScroll(mode) {
	animationMode = mode;
	$("#terminal").stop();
	$("#terminal").clearQueue();
	if (mode != "off") $("#terminal").animate({scrollTop: $("#terminal")[0].scrollHeight}, animationMode);
}
function changeFontColor(color) {
	$("body").css("color", color);
}

(function($){
	cursorBlink = setInterval(function(){$(".cursor").toggleClass("hidden")},500);
	threadList.height($(window).height()-30 + "px");
	threadList.append('<p></p><p class="server">* List of commands: Enter the command "help"</p><p class="server">Connecting.... May take a while due to heavy load...</p>');
	$(document).bind("keyup", g);
	$(document).bind("keydown", a);
	
	$("#input").click(function() {
		$("#command").focus();
	});
	
	$(window).resize(function() {
		threadList.height($(window).height()-30 + "px");
	});
	socket = io();
	function insertThread(data) {
		var title = data.title;
		var link = data.link;
		var message = "<p>" + title + "(<a href='" + link + "' target='_blank'>" + link + "</a>)</p>";
		threadList.append(message);
		if (animationMode != "off") {
			$("#terminal").animate({scrollTop: $("#terminal")[0].scrollHeight}, animationMode);
		}
	}
	
	function bindSocketEvents(){
		
		socket.on('disconnect', function () {
			threadList.append('<p class="server">Disconnected. Trying to connect...</p>');
		});
		
		socket.on('handshake', function(data){
			threadList.append('<p class="server">Connected!</p>');
			threadList.append('<p class="server">Users currently online: '+data.connectedClients+'</p>');
		});
		
		socket.on('users', function(data){
			threadList.append('<p class="server">Users currently online: '+data.connectedClients+'</p>');
		});
		
		socket.on('feed', function(data){
			if(streamming) { insertThread(data); }
		});
		
		socket.emit('handshake');
		
	}
	
	$(function(){
		bindSocketEvents();
	});
})(jQuery);