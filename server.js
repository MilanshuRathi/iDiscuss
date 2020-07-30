const express=require('express');
const app=express();
const http=require('http').createServer(app);
const port=process.env.PORT||3000;
app.use(express.static(`${__dirname}/public`));
app.get('/',(request,response)=>{
    response.sendFile(`${__dirname}/chat.html`);    
});
const io=require('socket.io')(http);
const users={};
io.on('connection',socket=>{
    socket.on('new-user-joined',details=>{
        // console.log(details);
        users[socket.id]=details;
        socket.broadcast.emit('user-joined',details);        
    });
    socket.on('send',message=>{
        // console.log(message,users[socket.id]);
        const details={...users[socket.id]};
        details.message=message;
        socket.broadcast.emit('recieve',details);
    });
    socket.on('disconnect',()=>{                                
        socket.broadcast.emit('left',{...users[socket.id]});
        delete users[socket.id];
    });    
});
http.listen(port,()=>{
    console.log('Server running on port:3000');
});