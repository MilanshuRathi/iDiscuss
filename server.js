// const express=require('express');
// const app=express();
// const server=require('http').Server(app);
// app.use(express.static('views'));
// app.get('/',(request,response)=>{
//     response.sendFile(`${__dirname}/views/chat.html`);
// });
const io=require('socket.io')(3000);
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
// app.listen(3000,()=>{
//     console.log('Server running on port:3000');
// })