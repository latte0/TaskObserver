var Slack = require('slack-node');
var schedule = require('node-schedule');
var app = require('express')();
var express = require("express")
var http = require("http")

var port = process.env.PORT || 5000;
app.use(express.static(__dirname + "/"))
var httpserver = http.createServer(app)
httpserver.listen(port)


webhookUri = "https://hooks.slack.com/services/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";

slack = new Slack();
slack.setWebhook(webhookUri);

var timeout = 3 * 7 * 24 * 60 * 60;
var n = 0;
/*
function task_sck() {

  setInterval(function() {
    n = n + 1;
    if(n > timeout){
   	 slack.webhook({
   	   channel: "#proj_princes",
   	   username: "task",
   	   text: "現在のタスク状況だドン!  http://datobs.herokuapp.com/#/"
   	 }, function(err, response) {
   	   console.log(response);
   	 });
    }


    console.log("hello" + n)
  }, 1000);
};

task_sck();
*/

var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, 5,6];
rule.hour = 17;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){

  slack.webhook({
   channel: "#proj_princes",
   username: "task",
   text: "現在のタスク状況だドン!  http://datobs.herokuapp.com/#/"
 }, function(err, response) {
   console.log(response);
 });

 console.log("hello")
});
