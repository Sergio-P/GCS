# Grouped Clients Server

Grouped Clients Server (GCS) is an Express, Socket.IO, Node-JS based server to provides functionalities of grouping online clients and transmit real-time messages between the members of the group.

## Installation
To run the GCS you must install Node JS in your local machine, download the project and install the following node modules:
* Express
* Socket.IO
* EJS

## Running
To launch the GCS just open a termianl, go to your project and type:

	node server.js

This will launch the GCS with the default settings.

## Testing
You can test GCS after running going to `localhost:8555` this will launch an exmaple application using GCS, try to open this page in new windows to group clients and test if the server is working.


## Configuration
At the beginning of the server file `server.js` you will find some settings variables you may config to your own project usage.

You can configure the port, minimun and maximum number of clients per group.

:information_source: Clients Ranking is not available yet.

## Usage
The GCS support 3 types of primitive messages to being emited:

* `find` you must call find when your client are looking for a group, this will add the client to the waiting list.

* `groupEmit` call it when you want to emit a custom event to all clients in your group, this call has 2 parameters:
  - `event` [String] the name of the custom event you want to emit.
  - `params` [Object] parameters you want to send in your event [Optional]
:warning: If groupEmit was success or failed it has no response, you must store if you are in a group in order to be sure that your mesage was delivered.

The GCS sends to clients 3 types of primitves messages:

* `group` When the client is join to a group, also gives the Group ID as parameter.

* `ungroup` When the client's group is dissolved (generally because a client is disconnected from the group)

* `[groupEmit.event]` Custom events emited when a client call to groupEmit, the name of the sending event to the clients is the same specifyed in event

There are 2 ways to use the GCS:

#### Using Javascript
You can use directly the Socket-IO scripts to emit and recieve messages like any other Socket-IO application. The following supported
