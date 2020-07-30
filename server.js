const io=require('socket.io')(8000);
const users=[];

io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined');        
    });
    socket.on('send',message=>{
        socket.broadcast.emit('recieve',{message,name:users[socket.id]});
    });
});