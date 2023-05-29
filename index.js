'use strict';

const express = require("express");

const PORT = process.env.PORT || 3006;
const INDEX = 'index.html';

const app = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));



//const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(app);

io.on("connection", (socket) => {
  let Name;
  let id = socket.id;
 
  console.log(id)
  //emito mensaje desde el servidor
  setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

  socket.on("conectado", ({name, room}) => {
    console.log(name)
    console.log(room)
      Name = name       
      const user = {id, Name}
      console.log(user)
      socket.join(Name) //crea el cuarto para la comunicacion.
     //mensaje de bot de servidor
   //  socket.emit('mensaje', { name: 'Bot Server Chat' , mensaje : `${Name} Bienvenido a la sala ${Name}` })
/// emite el ingreso a todos menos al usuario que acaba de ingresar.
     socket.to(Name).emit('mensaje', { name: Name , mensaje : `ha ingresado a la sala ${Name}` })
  });


  //recepcion del video
  socket.on('stream:audio', (image, room, name)=>{
    //console.log(image)
    socket.broadcast.to(room).emit('stream', {image, room, name})
  })

  

/// todos los mensajes se envia desde aqui
  socket.on("mensaje", ({name, mensaje, data, room}) => {

  console.log('ejecuto '+name) /// nombre
  console.log(mensaje) //mnensaje
  console.log('room: '+room) //room



    io.to(room).emit("mensaje", { name, mensaje, data,Name });
   io.to(Name).emit("mensaje", { name, mensaje, data, Name });



  });

  socket.on("grafica", ({name, mensaje, data, room}) => {

    console.log('ejecuto grafica'+name) /// nombre
    console.log(mensaje) //mnensaje
    console.log('room: '+room) //room
  
      io.to(room).emit("grafica", { name, mensaje, data,Name });
     io.to(Name).emit("grafica", { name, mensaje, data, Name });
    });

  socket.on("reinicio", ({name, mensaje, data, room}) => {

    console.log('ejecuto '+name) /// nombre
    console.log(mensaje) //mnensaje
    console.log('room: '+room) //room
  
      io.to(room).emit("reinicio", { name, mensaje, data,Name });
     io.to(Name).emit("reinicio", { name, mensaje, data, Name });
    });


    socket.on("reasignar", ({name, mensaje, data, room, oldroom}) => {

      console.log('ejecuto '+name) /// nombre
      console.log(mensaje) //mnensaje
      console.log('room: '+room) //room
    
        io.to(room).to(oldroom).emit("reasignar", { name, mensaje, data,Name });
       io.to(Name).emit("reasignar", { name, mensaje, data, Name });
      });
  

     /*  socket.on("closePop", ({name, mensaje, data, room}) => {

        console.log('ejecuto '+name) /// nombre
        console.log(mensaje) //mnensaje
        console.log('room: '+room) //room
      
          io.to(room).emit("closePop", { name, mensaje, data, Name});
          io.to(Name).emit("closePop", { name, mensaje, data, Name });
        }); */

  /// desconectar usuario
  socket.on("disconnect", (reason) => {
    console.log(reason)
  });
});


