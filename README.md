# Grouped Clients Server

Grouped Clients Server (GCS) is an Express, Socket.IO, Node-JS based server to provide functionalities of grouping online clients and transmit real-time messages between the members of the group.

## Installation
The prerequisites to run the GCS is to install Node JS in your local machine, download the project and install the following node modules (you may use `npm install ...`):
* Express
* Socket.IO
* EJS (for test application)

## Running
To launch the GCS just open a termianl, go to your project directory and type:

	node server.js

This will launch the GCS using the default settings.

## Testing
You can test GCS after running going to `localhost:8555` this will launch an example application using GCS, try to open this page in new tabs/windows to group clients and test if the server is working.


## Configuration
At the beginning of the server file `server.js` you will find some settings variables you may config to your own project usage.

You can configure the port, minimun and maximum number of clients per group.

:information_source: Client's Ranking is not available yet.

## Usage
The GCS support 2 types of primitive messages to being emited by clients:

* `find` you must call find when your client are looking for a group, this will add the client to the waiting list.

* `groupEmit` call it when you want to emit a custom event to all clients in your group, this call has 2 parameters:
  - `event` [String] the name of the custom event you want to emit.
  - `params` [Object] parameters you want to send in your event [Optional]
:warning: If groupEmit was successful or failed, it has no response, you must store locally if you already joined a group, in order to be sure that your message was delivered.

The GCS sends to clients 3 types of primitive messages:

* `group` When the client is join to a group, also gives the Group ID as parameter.

* `ungroup` When the client's group is dissolved (generally because a client is disconnected from the group)

* `[groupEmit.event]` Custom events emited when a client call to groupEmit, the name of the sending event to the clients is the same specifyed in event

====

There are 2 ways to use the GCS:

#### Using Javascript
You can use directly the Socket-IO scripts to emit and recieve messages like any other Socket-IO application. 

Use `io.emit(...)` to emit the supported messages to the server. And use `io.on(...)` to listen to server described events or custom events.

#### Using HTTP Request
:information_source: In development ...
