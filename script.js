var client;
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
// filters out empty messages and messages including content from the filterBox
function onMessageArrived(message) {
  if (message.payloadString && message.payloadString.trim() && !containsFiltered(message.payloadString)) {
    document.getElementById("chatbox").value = message.payloadString + '\n' + document.getElementById("chatbox").value;
    console.log("onMessageArrived:" + message.payloadString);
  }
}


// function to send the message
function send() {
  //checks if the client is actually connected before sending the message
  if (!client || client == null || !client.isConnected()) {
    alert("You're not connected!");
    return;
  }

  msg = document.getElementById("message").value;

  //checks if the message isn't empty
  if (!msg || !msg.trim()) {
    alert("The message is empty!");
    document.getElementById("message").value = "";
    return;
  }

  //creates a new message and sends it
  message = new Paho.Message(clientName + " says: " + document.getElementById("message").value);
  message.destinationName = topicName;
  client.send(message);
  document.getElementById("message").value = "";
}


// connect to specified broker and topic
function connect() {
  //disconnects from previous session if present
  disconnect();
  //updates values of broker, port, client, topic
  collectValues();

  // Create a client instance
  client = new Paho.Client(brokerName, portNumber, clientName);

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({ onSuccess: onConnect });
}


// clears the chat history
function clearChat() {
  document.getElementById("chatbox").value = "";
}


// updates the values of the global variables
function collectValues() {
  clientName = document.getElementById("client").value;
  brokerName = document.getElementById("broker").value;
  portNumber = Number(document.getElementById("port").value);
  topicName = document.getElementById("topic").value;
}


// disconnects from current broker and topic
function disconnect() {
  if (client && client.isConnected()) {
    client.disconnect();
    document.getElementById("connectionStatus").innerText = "Disconnected";
  }
}


//checks if the given message contains one of the words to be filtered out
function containsFiltered(msg) {
  var filterWords = document.getElementById("filterBox").value.split(" ");

  if (filterWords[0] == "") {
    return false;
  }

  for (var i = 0; i < filterWords.length; i++) {
    if (msg.includes(filterWords[i])) {
      console.log("Filtered message containing: " + filterWords[i]);
      return true;
    }
  }
}