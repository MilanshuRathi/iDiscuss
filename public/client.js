const socket=io();
const male=['https://image.flaticon.com/icons/svg/145/145867.svg','https://image.flaticon.com/icons/svg/145/145859.svg','https://image.flaticon.com/icons/svg/163/163801.svg'];
const female=['https://image.flaticon.com/icons/svg/998/998876.svg','https://image.flaticon.com/icons/svg/3105/3105828.svg','https://image.flaticon.com/icons/svg/2810/2810675.svg'];

const form=document.querySelector('.msger-inputarea');
const msgContainer=document.querySelector('.msger-chat');
const msgInput=document.querySelector('.msger-input');
const play=()=>{
    const audio=new Audio('/ping.mp3');
    audio.play();
}
const messageAppend=(userDetails,position)=>{    
    const currDate=new Date();
    let hour=currDate.getHours(),min=currDate.getMinutes();
    if(hour<10)
        hour=`0${hour}`;
    if(min<10)
        min=`0${min}`;
    const messageElement=`<div class="msg ${position}-msg">
    <div
     class="msg-img"
     style="background-image: url(${userDetails.imageUrl})"></div>
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${userDetails.name}</div>
        <div class="msg-info-time">${hour}:${min}</div>
      </div>
      <div class="msg-text">
        ${userDetails.message}
      </div>
    </div>
  </div>`;  
  msgContainer.insertAdjacentHTML('beforeend',messageElement);      
}
// const notiAppend=(message,)
//Main Execution starts
let name='';
while(name.trim()==='') name=prompt('Enter your Nick Name to join');
let gender='';
while(gender!=='male'&&gender!=='female') gender=prompt('Enter your gender:(male or female)').toLowerCase();
const imageUrl=gender==='male'?male[Math.floor(Math.random()*3)]:female[Math.floor(Math.random()*3)];
const user={name,gender,imageUrl};
socket.emit('new-user-joined',user);
socket.on('user-joined',data=>{ 
    const message='Joined the chat'; 
    const newUser={...data};
    newUser.message=message;     
    play();    
    messageAppend(newUser,'left');
    scrollToBottom();
});
socket.on('recieve',data=>{
    // console.log(data);
    play();
    messageAppend(data,'left');
    scrollToBottom();
});
socket.on('left',userData=>{
    if(userData&&userData.name)
    {userData.message='Left the chat';
    messageAppend(userData,'left');}
    scrollToBottom();
});
form.addEventListener('submit',event=>{
    event.preventDefault();  
    if(msgInput.value.trim()!==''){
    const newUser={...user};
    newUser.message=msgInput.value.trim();      
    messageAppend(newUser,'right');
    msgInput.value='';
    socket.emit('send',newUser.message);  
    scrollToBottom();}     
});
function scrollToBottom() {
  msgContainer.scrollTop = msgContainer.scrollHeight;
};
