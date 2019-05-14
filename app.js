// Servidor: app.js
 // Iniciando servidor HTTP
 
 var express = require('express')
    ,app = express()
    ,server = require('http').createServer(app)
    ,io = require('socket.io').listen(server)
    ,fs = require('fs')
    ,moment = require('moment')
 ;

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
server.listen(3000, function() {
    console.log("Servidor rodando!");
});

 function index(req, res){
   fs.readFile(__dirname + '/public/index.html', function(err, data){
    res.writeHead(200);
        res.end(data);
    });
 };
 // Iniciando Socket.IO
 var online = 0;
 // Evento connection ocorre quando entra um novo usuário.
 io.on('connection', function(socket){
    // Incrementa o total de visitas no site.
    moment.locale('pt-BR');
    var time = moment().format('hh:mm:ss');
    var retorno = { time };

    socket.on('welcome', function(data) {
        retorno = { ...retorno, name: data.name, message: 'entrou...' };
        socket.emit('welcome', retorno);
        socket.broadcast.emit('welcome', retorno);
    });

    socket.on('message', function(data) {
        retorno = { ...retorno, name: data.name, message: data.message };
        socket.emit('message', retorno);
        socket.broadcast.emit('message', retorno);
    });

    online++;
    // Envia o total de visitas para o novo usuário.
    socket.emit('online', online);
    socket.broadcast.emit('online', online);
    // Evento disconnect ocorre quando sai um usuário.
    socket.on('disconnect', function(data) {
        online--;
        socket.broadcast.emit('online', online);

        /*
        retorno = { ...retorno, name: data.name, message: 'saiu...' };
        socket.emit('left', retorno);
        socket.broadcast.emit('left', retorno);
        */
    });

 });