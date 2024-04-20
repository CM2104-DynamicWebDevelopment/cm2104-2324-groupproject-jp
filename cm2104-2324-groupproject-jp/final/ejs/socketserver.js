io.on("connection", function(socket){
    // either with send()
    socket.send("Hello!");
  
    // or with emit() and custom event names
    socket.emit("greetings", "Hey!");
  
    // handle the event sent with socket.send()
    socket.on("message", function(data){
      console.log(data);
    });
  
    // handle the event sent with socket.emit()
    socket.on("salutations", function(message){
      console.log(message);
    });
  });

