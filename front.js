var chatmsgStack;
var userTextbox;
var userSubmitBtn;
var openChatBtn;
var closeChatBtn;
var minimizeChatBtn;
//const API_URL = "http://localhost:5566/api/chat";
const API_URL = "http://125.181.9.94:5566/api/chat";


function printChatmsg(text, who, pict, isMe){
	elem = (isMe ? '<li class="isMe">' : '<li>') +
	'<img class="pict" src="' + pict + '"/>' +
	'<div class="name">' + who + '</div>' +
	'<div class="text">' + text + '</div>' +
	'<div class="timestamp">' + new Date().toLocaleTimeString() + '</div>' +
	'</li>';
	chatmsgStack.append(elem);
	chatmsgStack.animate({
		scrollTop: chatmsgStack.prop('scrollHeight')
	}, 1000);
}

function msgBot(text) {
	printChatmsg(text, '챗봇', 'bot.png', false);
}
function msgUser(text) {
	printChatmsg(text, '사용자', 'human.png', true);
}

function doQueryChatbot(qtext) {
	msgUser(qtext);

	reqData = {
		qtext: qtext,
		meta: {nickname: "frontWebpage_doumdoum2"}
	}
	$.ajax({
		url: API_URL,
		type: "POST",
		data: JSON.stringify(reqData),
		dataType: "json",
		contentType: "application/json",
		success: function(d){
			// d = {text:..., meta:,,,}
			setTimeout(function(){
				msgBot(d.text);
			}, 500);
		},
		error: function(d){
			console.log('doQueryChatbot: ' + d.responseText);
			msgBot('서버 연결에 실패하였습니다.')
		}
	});
}

function hdlUserSubmit() {
	qtext = userTextbox.val().trim();
	if (qtext.length > 0) {
		qtext = userTextbox.val().trim();
		userTextbox.val('');
		doQueryChatbot(qtext);
	}
}
function hdlEnterOnTextbox(evt) {
	// which = 13 : Enter
	if (evt.which == 13) {
		return hdlUserSubmit();
	}
}

function hdlOpenChat() {
	if ($(".chatmsgstack").has("li").length == 0) {
		msgBot('안녕하세요.');
	}
	$(".chat").show();
	$(".chatroom").show();
	openChatBtn.hide();
	checkMinimizeIcon();
}

function hdlCloseChat() {
	$(".chat").hide();
	$(".chatmsgstack li").remove();
	openChatBtn.show();
}

function hdlMinimizeChat() {
	$(".chatroom").toggle();	
	openChatBtn.hide();
	checkMinimizeIcon();
}

function checkMinimizeIcon() {
	if ($(".chatroom").is(":visible")) {
		minimizeChatBtn.text("_");
	}
	else {
		minimizeChatBtn.text("\u2610");
	}
}

function readyGlobalElems(){
	chatmsgStack = $("#dmstack");
	userTextbox = $("#dmtext");
	userSubmitBtn = $("#dmbtn");
	openChatBtn = $("#openChat");
	closeChatBtn = $("#closeChat");
	minimizeChatBtn = $("#minimizeChat");
}
function main() {
	readyGlobalElems();
	userSubmitBtn.click(hdlUserSubmit);
	userTextbox.keydown(hdlEnterOnTextbox);
	openChatBtn.click(hdlOpenChat);
	closeChatBtn.click(hdlCloseChat);
	minimizeChatBtn.click(hdlMinimizeChat);
	console.log('Doum front-end. - Web page');

	msgBot('안녕하세요.');
}

$(document).ready(main);

