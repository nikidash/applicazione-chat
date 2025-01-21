var client = null;
var clientName;
var brokerName;
var portNumber;
var topicName;


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription
  console.log("onConnect");
  client.subscribe(topicName);
  console.log("Connected to " + brokerName + ":" + portNumber + " as " + clientName + " on topic " + topicName);
  document.getElementById("connectionStatus").innerText = "Connected to " + brokerName + ":" + portNumber + " as " + clientName + " on topic " + topicName;
}


// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    document.getElementById("connectionStatus").innerText = "Disconnected";
  }
}


// called when a message arrives
function onMessageArrived(message) {
  if (message.payloadString != "" && message.payloadString != '\n' && !message.payloadString.includes("Chonburi.Hospital")){
    console.log("onMessageArrived:" + message.payloadString);
    document.getElementById("chatbox").value = message.payloadString + '\n' + document.getElementById("chatbox").value;
  }
}


//function to send the message
function send() {
  msg = document.getElementById("message").value;
  if (msg != "" && msg != '\n') {
    message = new Paho.Message(clientName + " says: " + document.getElementById("message").value);
    message.destinationName = topicName;
    client.send(message);
    document.getElementById("message").value = "";
  }
}


//connect to specified broker and topic
function connect() {
  disconnect();
  collectValues();

  // Create a client instance
  client = new Paho.Client(brokerName, portNumber, clientName);

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({ onSuccess: onConnect, cleanSession: true });
}


//clears the chat history
function clearChat() {
  document.getElementById("chatbox").value = "";
}


//updates the values of the global variables
function collectValues() {
  clientName = document.getElementById("client").value;
  brokerName = document.getElementById("broker").value;
  portNumber = Number(document.getElementById("port").value);
  topicName = document.getElementById("topic").value;
}

//disconnects from current broker and topic
function disconnect() {
  if (client && client.isConnected()) {
    client.disconnect();
    document.getElementById("connectionStatus").innerText = "Disconnected";
  }
}