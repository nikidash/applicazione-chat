// Create a client instance
var client = new Paho.Client(document.getElementById("broker").value, Number(8080), document.getElementById("client").value);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({ onSuccess: onConnect });


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription
  console.log("onConnect");
  client.subscribe(document.getElementById("topic").value);
  console.log("Connesso a " + document.getElementById("broker").value + " come " + document.getElementById("client").value + " con topic " + document.getElementById("topic").value);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:" + message.payloadString);

  if (message.payloadString != "" && message.payloadString != '\n')
    document.getElementById("chatbox").value += message.payloadString + '\n';
}


//funzione per connettersi
function connetti() {
  client.disconnect();
  client = new Paho.Client(document.getElementById("broker").value, Number(document.getElementById("port").value), document.getElementById("client").value);

  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  client.connect({ onSuccess: onConnect });
}

//funzione per mandare un messaggio
function send() {
  if (document.getElementById("message").value != "" && document.getElementById("message").value != '\n') {
    message = new Paho.Message(document.getElementById("client").value + ": " + document.getElementById("message").value);
    message.destinationName = document.getElementById("topic").value;
    client.send(message);
    document.getElementById("message").value = "";
  }
}