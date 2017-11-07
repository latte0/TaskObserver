
var ws = require('websocket.io');
var mysql = require('mysql');

//connect().use(serveStatic(__dirname)).listen(process.env.PORT || 5000);

var app = require('express')();
var http = require("http")
var express = require("express")
var schedule = require('node-schedule');
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var httpserver = http.createServer(app)
httpserver.listen(port)

db_config = {
  host : 'us-cdbr-iron-east-04.cleardb.net',
  user : 'b0d99bf6a38cd0',
  password : 'ac1940d4',
  database: 'heroku_5f421e6739f84b7',
}


var server;


server = ws.attach(httpserver);

var connection = null;  // Recreate the connection, since

function handleDisconnect() {
  if(connection !== null){
    connection.end();
    connection.destroy();
    connection = null;
  }
  if(connection === null) connection = mysql.createConnection(db_config); // Recreate the connection, since

                      // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}


handleDisconnect();


server.on('connection', function(socket) {
    socket.on('message', function(data) {
            console.log("hello" + data)
            var data = JSON.parse(data);

            var d = new Date();
            data.lastDate = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
          //  data = JSON.stringify(data);


            if(data.type=='add'){

              var qs = "insert into test values('" +
              data.uuid+"','"+
              data.title+"','"+
              data.description+"','"+
              data.author+"','"+
              data.lastDate+"','" +
              data.state +"')";

              console.log(qs)

              connection.query(qs, function(err, rows, fields) {

              });
              server.clients.forEach(function(client) {
                client.send(JSON.stringify(data));
              });
            }
            else if(data.type=='init'){


              connection.query('select * from test', function(err, rows, fields) {

                  console.log("init query: " + JSON.stringify(rows));
                    var filetype = {
                      type: "init",
                      datalist: JSON.stringify(rows)
                    }
                    if(filetype.datalist === undefined)
                    {

                    }
                    else
                    {
                      console.log(data);
                      senddata = JSON.stringify(filetype);
                      console.log(senddata)
                      /*
                      server.clients.forEach(function(client) {
                        client.send(senddata);
                      });
                      */
                      socket.send(senddata);
                  }
              });
            }
            else if(data.type=='delete'){
              connection.query("delete from test where uuid = '" + data.uuid + "'" , function(err, rows, fields) {
                server.clients.forEach(function(client) {
                  client.send(JSON.stringify(data));
                });
            });
            }
            else if(data.type=='edit')
            {


                connection.query("update test set " + data.content + " = '"+ data.value + "' where uuid = '" + data.uuid + "'"  , function(err, rows, fields) {

                      });

                      server.clients.forEach(function(client) {
                      　if (client == undefined || client == null){
                        console.log("null client detected");
                      }
                        else {
                          client.send(JSON.stringify(data));
                        }
                      });
            }


    });


});
