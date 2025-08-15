import express from 'express';
import http from 'http';
import cors from 'cors';
import {Server} from 'socket.io';
const online=new Map();
const app=express();
const server=http.createServer(app);
const port=process.env.PORT||8080;
app.use(cors());
const io=new Server(server,cor);
const conreg=(socket)=>{
    console.log('user connected having socket id',socket.id);
    const reg=({userid})=>{
        if(online.has(userid)){
            io.to(socket.id).emit("confirm",{code:'0',message:"A user already found with this user id"});
            return;
        }
       online.set(userid,socket.id);
       socket.to(online.get(userid)).emit("confirm",{code:'1',message:"user has been registered successfully"});
             


    };



const checkuser=({targetid})=>{
    if(!online.has(targetid)){
     io.to(socket.id).emit("targetconf",{code:'0',message:"Entered receiver id is not online yet so communication is not possible"});
     return;

    }
    io.to(socket.id).emit("targetconf",{code:'1',message:"Receive is online talk and enjoy face to face"});



}   

const calluser=({to,offer,from})=>{
    io.to(online.get(to)).emit("receivecall",{from:from,offer});
    console.log("the offer is",offer);
    
}

const ans=({to,answer})=>{
    if(online.has(to)){
        io.to(online.get(to)).emit("answercall",{answer});
        return;
    }
    io.to(socket.id).emit("answercheck",{code:0,message:"receiver disconnected"});

}
const candidate=({to,candidate})=>{
    if(!online.has(to)){
        io.to(online.get(to)).emit("errcand",{code:'0',message:"given receiver disconnected"});
        return;
    }
    io.to(online.get(to)).emit("ice-candidate",{candidate});




}
const dis= () => {
  for (const [userId, socketId] of online.entries()) {
    if (socketId === socket.id) {
      online.delete(userId);
      console.log(`${userId} disconnected and was removed`);
      break;
    }
  }
}

const rej=({to,code})=>{
if(code==='1'){
  io.to(online.get(to)).emit("rejectcall",{code});
    return;
}

    
}


    socket.on('register',reg);
    socket.on('targetcheck',checkuser);
    socket.on('calluser',calluser);
    socket.on('answer-call',ans);
    socket.on('ice-candidate',candidate);
    socket.on('disconnect',dis);
    socket.on("rejectcall",rej);





}
io.on("connection",conreg);

const confirm=()=>{
    console.log("the server is running on the port 8080");
}

server.listen(8081,confirm);



