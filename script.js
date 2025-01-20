function connessione() {
  var broker = document.getElementById("broker").value;
  var port = document.getElementById("port").value;
  var clientName = document.getElementById("client").value;

  
  console.log("Funzoine connessione\ndati connessione : " + broker + " " + port + " " + clientName);

  client = new Paho.Client(broker, Number(port), clientName);
  
  client.connect({onSuccess:onConnect});
}

function sendMessage(testo){
  topic = document.getElementById("topic").value;
  message = new Paho.Message(testo.value);
  message.destinationName = topic;
  console.log("Funzione sendMessage\nmessaggi mandati a topic: " + topic + "\nmessaggio mandato: " + testo.value);
  client.send(message);
}

// Create a client instance
//var client = new Paho.Client("test.mosquitto.org", Number(8080), "bruh");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
//client.connect({onSuccess:onConnect});


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  var testoTopic = document.getElementById("topic").value;
  client.subscribe(testoTopic);
  console.log("Connected to topic: " + testoTopic);
  //message = new Paho.Message("Hello");
  //message.destinationName = "World";
  //client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}