socket.on("connect", function(){
    // either with send()
    socket.send("Hello!");

    // or with emit() and custom event names
    socket.emit("salutations", "Bout Ye!");
});

// handle the event sent with socket.send()
socket.on("message", function(data){
    console.log(data);
});

// handle the event sent with socket.emit()
socket.on("greetings", function(message){
    console.log(message);
});

