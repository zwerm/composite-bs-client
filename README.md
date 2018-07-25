# Composite BotSocket Client & Friends

A Composite BotSocket Client implementation designed for easy expandability that's ready-to-go out of the box,
and that comes packed with leafs that are ready to be composited.

The `CompositeBSClient` is based off the [Composite design pattern](https://en.wikipedia.org/wiki/Composite_pattern).

Essentially, `BSClientLeaf` defines a series of functions that the `CompositeBSClient` calls on all registered leafs as part of its regular operations.
By creating leafs that implement these methods, the functionality of the `CompositeBSClient` can be extended at ease, without the overhead that would come with using inheritance.

A collection of leafs are provided in this package to make it easy to quickly add standard functionality.

Feel free to make a PR to add new leafs to this collection, or to improve on existing implantation. We'd love to hear from you!

Here's an example of setting up a `CompositeBSClient` instance with some leafs:

```javascript
const { EventEmitter } = require('events');

const CompositeBSClient = require('@zwerm/composite-bs-client/CompositeBSClient');

// region leafs
const TalkingLeaf = require('@zwerm/composite-bs-client/leafs/TalkingLeaf');
const CookieUserIdLeaf = require('@zwerm/composite-bs-client/leafs/userid/CookieUserIdLeaf');
const StaticTimezoneLeaf = require('@zwerm/composite-bs-client/leafs/timezone/StaticTimezoneLeaf');
const BrowserLocationLeaf = require('@zwerm/composite-bs-client/leafs/location/BrowserLocationLeaf');

const ToggleDisabledOnConnectLeaf = require('@zwerm/composite-bs-client/leafs/ToggleDisabledOnConnectLeaf');
const SendInputQueryOnFormSubmitLeaf = require('@zwerm/composite-bs-client/leafs/SendInputQueryOnFormSubmitLeaf');
const ScrollToBottomOnLetterLeaf = require('@zwerm/composite-bs-client/leafs/ScrollToBottomOnLetterLeaf');
const EmitStatusMessageEventsLeaf = require('@zwerm/composite-bs-client/leafs/EmitStatusMessageEventsLeaf');
const AutoReconnectLeaf = require('@zwerm/composite-bs-client/leafs/AutoReconnectLeaf');
const SendEventOnHandshakeLeaf = require('@zwerm/composite-bs-client/leafs/SendEventOnHandshakeLeaf');
// endregion

const statusEmitter = new EventEmitter();

statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECTING, ({ isReconnection }) => console.warn(`${isReconnection ? 're' : ''}connecting...`));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_CONNECT, () => console.log('connected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_DISCONNECT, () => console.warn('disconnected'));
statusEmitter.on(EmitStatusMessageEventsLeaf.E_STATUS_ERROR, () => console.error('unable to reconnect'));

statusEmitter.on(AutoReconnectLeaf.E_STATUS_RECONNECT_COUNTDOWN, ({ secondsUntilReconnect }) => console.log(`connection lost, retrying in ${secondsUntilReconnect}...`));

CompositeBSClient
    .newForZwermChat(
        'wss://chat.zwerm.io',
        'team-id',
        'bot-id',
        'channel-id'
    )
    .registerLeaf(new TalkingLeaf())
    .registerLeaf(new CookieUserIdLeaf())
    .registerLeaf(new StaticTimezoneLeaf(require('moment-timezone').tz.guess()))
    .registerLeaf(new BrowserLocationLeaf())
    .registerLeaf(new ToggleDisabledOnConnectLeaf(document.getElementById('#user-says')))
    .registerLeaf(new SendInputQueryOnFormSubmitLeaf(document.getElementById('#user-says-send'), document.getElementById('#user-says')))
    .registerLeaf(new ScrollToBottomOnLetterLeaf(document.getElementById('message-container')))
    .registerLeaf(new EmitStatusMessageEventsLeaf(statusEmitter))
    .registerLeaf(new AutoReconnectLeaf(statusEmitter))
    .registerLeaf(new SendEventOnHandshakeLeaf('WELCOME'))
    .connect();
```

The above example results in a `CompositeBSClient` that will...

* Speak messages from the server when possible. (`TalkingLeaf`)
* Persist the server-provided user id across page refreshers. (`CookieUserIdLeaf`)
* Include the timezone that the user is in in messages sent to the server, as guessed by `moment-timezone`. (`StaticTimezoneLeaf`)
* Include the location of the user, using the [geolocation api](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation). (`BrowserLocationLeaf`)
* Set the disabled state of a `HTMLElement` based on when the `CompositeBSclient` connects and disconnects from the server. (`ToggleDisabledOnConnectLeaf`)
* Send the value of an `HTMLInputElement` as a query when a `HTMLFormElement` is submitted. (`SendInputQueryOnFormSubmitLeaf`)
* Scroll to the bottom of a DOM element when a new StaMP letter is received. (`ScrollToBottomOnLetterLeaf` )
* Emit status messages about the `CompositeBSClient`s connection to the BotSocket server as events. (`EmitStatuMessageEventsLeaf`)
* Attempt to automatically reconnect to the BotSocket server on disconnect, after a delay. (`AutoReconnectLeaf`)
* Sends an event message of 'WELCOME' once the `CompositeBSClient` has shaken hands with the server. (`SendEventOnHandshakeLeaf`)


## Leafs on the wind

The leafs system is very simple and easy to use.

`BSClientLeaf`s are registered to a `CompositeBSClient` instance, which calls methods on all registered leafs as part of its usual operations.

When a leaf is registered on a `CompositeBSClient`, it's given a reference to that client. This provides leafs with a means to call functions
on the client they're registered to, expanding their functionality and potential.

These methods are all defined in the `BSClientLeaf` base class. When the `CompositeBSClient` goes to make a call on one of these methods,
all the registered leafs are checked, and any that actually implement that method are called.

Leafs are called in the order that they are registered, with return values cascading down as the last parameter, allowing for each call to mutate the return value.

Because of the nature of objects in Javascript, you must take great care when mutating objects with leafs, as `Object.assign` won't merge child properties.
This is also the reason why we strongly recommend you use our abstract leafs whenever possible & available for features that involve touching objects.

Here is a quick rundown on the methods defined in `BSClientLeaf`, and their common use cases:

#### `register(compositeBSClient: CompositeBSClient): void`

This method registers the leaf to the given `CompositeBSClient`.

This method should be used for handling initialisation actions, such as attaching event listeners.

Remember to call `super.register(compositeBSClient)`, otherwise you risk your leaf not working properly.

#### `deregister(): void`

This method de-registers the leaf from the `CompositeBSClient` it's registered to.

This method should be used for handling unwinding actions, such as removing event listeners.

Remember to call `super.deregister()`, otherwise you risk your leaf not working properly.

#### `preConnect(isReconnecting: boolean): void`

This method is called by the `CompositeBSClient` before it tries to connect to the BotSocket server.

The `isReconnecting: boolean` parameter represents if the client is attempting to **re**connect to the server, after having been previously disconnected.

This method doesn't return anything.

#### `postConnect(): void`

This method is called by the `CompositeBSClient` after it has successfully connected to the BotSocket server.

This method is called *before* handing is done with the BotSocket server, making it unsafe to send messages (event, query or otherwise) in this method.

This method takes no parameters.

This method doesn't return anything.

#### `preDisconnect(disconnectCode: number): void`

This method is called by the `CompositeBSClient` before it tries to disconnect from the BotSocket server.

The `disconnectCode: number` parameter represents the code that will provided as the reason for disconnection.

This method doesn't return anything.

#### `postDisconnect(disconnectCode: number): void`

This method is called by the `CompositeBSClient` after it has been disconnected from the BotSocket server.

The `disconnectCode: number` parameter represents the code that was provided as the reason for disconnection.

This method doesn't return anything.

#### `errored(): void`

This method is called by the `CompositeBSClient` when the socket connection errors out.

This method takes no parameters.

This method doesn't return anything.

#### `postHandshake(): void`

This method is called by the `CompositeBSClient` after it has shaken hands with the BotSocket server.

This method is called *after* handshaking is done with the BotSocket server, making it safe to send messages (event, query or otherwise) to the server in this method.

This method takes no parameters.

This method doesn't return anything.

#### `supplementClientHandshake(clientHandshake: BotSocket.Protocol.Messages.ClientHandshakeData): BotSocket.Protocol.Messages.ClientHandshakeData`

This method is for supplementing the data that's going to be sent as part of a BotSocket `ClientHandshake`.

The `clientHandshake: BotSocket.Protocol.Messages.ClientHandshakeData` parameter contains the *original* handshake data that will be sent to the server.

This method returns the modified data to be sent to the server.

Leafs can get the value returned by the last leaf in the branch via the `arguments` variable, like so:

```
const lastResult = arguments[arguments.length - 1];
```

#### `supplementStaMPQuery(query: StaMP.Protocol.QueryMessage): StaMP.Protocol.QueryMessage`

This method is for supplementing a StaMP query message that's going to be sent to the BotSocket server.

The `query: StaMP.Protocol.QueryMessage` parameter contains the *original* `StaMP` query message that will be sent to the server.

This method returns a new modified query message object, based on the original & previous query message objects.

Leafs can get the value returned by the last leaf in the branch via the `arguments` variable, like so:

```
const lastResult = arguments[arguments.length - 1];
```

Keep in mind that `StaMP` query messages have a `data` field of type object, and that `Object.assign` *doesn't* merge child object properties.
If you implement this method, you must make sure to merge the `data` the field as well. See `AbstractUserIdLeaf` for an example of this.

#### `supplementStaMPEvent(event: StaMP.Protocol.EventMessage): StaMP.Protocol.EventMessage`

This method is for supplementing a StaMP event message that's going to be sent to the BotSocket server.

The `event: StaMP.Protocol.EventMessage` parameter contains the *original* `StaMP` event message that will be sent to the server.

This method returns a new modified event message object, based on the original & previous event message objects.

Leafs can get the value returned by the last leaf in the branch via the `arguments` variable, like so:

```
const lastResult = arguments[arguments.length - 1];
```

Keep in mind that `StaMP` event messages have a `data` field of type object, and that `Object.assign` *doesn't* merge child object properties.
If you implement this method, you must make sure to merge the `data` the field as well. See `AbstractUserIdLeaf` for an example of this.

This also applies to any modifications being made to the `payload` field of event messages, which is also of type object.

#### `processServerHandshake(serverHandshake: BotSocket.Protocol.Messages.ServerHandshakeData): void`

This method is for processing the data returned by the BotSocket server as part of its handshaking.

The `serverHandshake: BotSocket.Protocol.Messages.ServerHandshakeData` parameter contains the data passed by the server.

#### `processRenderLetterRequest(renderLetterData: BotSocket.Protocol.Messages.RenderLetterData): void`

This method is for processing the data passed by the server in a `render-letter` request.

The `renderLetterData: BotSocket.Protocol.Messages.RenderLetterData` parameter contains the data passed by the server.

### Leafs included in this starter pack

Here is a brief overview of the leafs included in this package:

| Class name                       | Usage
| -------------------------------- |:---
| `AbstractLocationLeaf`           | Abstract leaf that handles managing & providing a `location` as and when required during the usual operations of a `CompositeBSClient`.
| `StaticLocationLeaf`             | Location-managing leaf that that simply uses a static lat & lng that can be changed with getters & setters.
| `BrowserLocationLeaf`            | Location-managing leaf that gets its `location` via the geolocation browser API.
| `AbstractTimezoneLeaf`           | Abstract leaf that handles managing & providing a `timezone` as and when required during the usual operations of a `CompositeBSClient`.
| `StaticTimezoneLeaf`             | Timezone-managing leaf that that simply uses a static `timezone` that can be changed with getters & setters.
| `AbstractUserIdLeaf`             | Abstract leaf that handles managing & providing a `user` as and when required during the usual operations of a `CompositeBSClient`.
| `CookieUserIdLeaf`               | UserId-managing leaf that persists a `userId` via a browser cookie.
| `SessionStorageUserIdLeaf`       | UserId-managing leaf that persists a `userId` using the `sessionStorage` api.
| `StaticUserIdLeaf`               | UserId-managing leaf that that simply uses a static `userId` that can be changed with getters & setters.
| `AutoReconnectLeaf`              | Leaf that handling automatic reconnects after a delay when the `CompositeBSClient` disconnects from the BotSocket server.
| `ScrollToBottomOnLetterLeaf`     | Leaf that scrolls to the bottom of an `HTMLElement` when a `render-letter` request arrives.
| `ScrollToPositionOnLetterLeaf`   | Leaf that scrolls to a position of an `HTMLElement` when a `render-letter` request arrives.
| `ScrollToTopOnLetterLeaf`        | Leaf that scrolls to the top of an `HTMLElement` when a `render-letter` request arrives.
| `EmitStatusMessageEventsLeaf`    | Leaf that emits status messages events based on the usual operations of a `CompositeBSClient`, via an `EventEmitter`.
| `EmitLetterMessageEventsLeaf`    | Leaf that emits letter messages events based on the usual operations of a `CompositeBSClient`, via an `EventEmitter`.
| `TalkingLeaf`                    | Leaf that speaks `StaMP` messages (that have audio).
| `ToggleDisabledOnConnectLeaf`    | Leaf that toggles the disabled state of an `HTMLElement` when a `CompositeBSClient` connects and disconnects.
| `SendInputQueryOnFormSubmitLeaf` | Leaf that sends the value of an `HTMLInputElement` when an `HTMLFormElement` is submitted.
| `SendEventOnHandshakeLeaf`       | Leaf that sends an event message to the server once handshaking is complete, triggering a bot response (if supported).
| `ConversationDataIncluderLeaf`   | Leaf that handles including conversation store & context in the data property of every message send by the `CompositeBSClient`.

Note that not all of the leafs use methods defined in `BSClientLeaf`. Leafs are also useful as way of grouping functionality related to the `CompositeBSClient`.

## Identifying the user of a client

The `userId` in the BotSocket system is how users are identified and tracked. Each id represents a whole new user to `Zwerm`.

It has two primary uses in the BotSocket system:
* BotSocket clients use it as the `senderId` property in `StaMP` query messages, to indicate where the messages came from.
* BotSocket server uses it to group client connections, and to deliver messages sent via the API to the correct clients.

The BotSocket server provides connected clients with the `userId` to use, passed as part of the servers `handshake` request with the client.

A client can specific its own `userId` as part of the clients `handshake` request with the server.
The server will take that `userId` into account when deciding which `userId` to provide the client with.

If the server accepts the `userId` provided by the client, it'll use that `userId`, otherwise it'll generate one for the client to use.
More on this in the "Handshaking" section of "BotSocket 101".

The `userId` should be a `string` - if it's not, the server will typecast it to a `string`, and return the result back to the client.
This is because `Zwerm` requires `string` ids, and will throw an error if an id is used that's not of type `string`.

By default, the `CompositeBSClient` will just accept whatever `userId` the server generates, with no form of persistence between sessions.

Control over the userId is done using leafs; for security and ease of use, we recommend using the `AbstractUserIdLeaf`.

This leaf contains all the implementation code required to properly control the `userId`, defining an abstract getter & setter for you to implement.
By using this leaf, you only have to focus on ensuring the getter & setter returns the desired `userId`, and not how that value is actually used by the client.

## BotSocket 101

BotSocket is a protocol that defines the structure implementers expect WebSocket messages to be in when communicating.

It also loosely defines 'best behaviour' of clients and servers, that is followed by Zwerms implementation of BotSocket.

A BotSocket message is made up of two parts: the `request` string property, and the `data` object property.

The `request` property is a string whose defined value denotes the structure to expect of the `data` property, as well as how that data should be used.

Currently, the following request types are defined:

* `handshake`, denoting that `data` will match either `ClientHandshakeData` or `ServerHandshakeData`, depending on if it was a BotSocket client or server that sent the message.
* `submit-query`, denoting that `data` will match `SubmitQueryData`, which in turn defines it'll match `StaMP.Protocol.Messages.StandardisedQueryMessage`.
* `render-letter`, denoting that `data` will match `RenderLetterData`, which defines an interface with a `letter` property, of type `StaMP.Protocol.Letter`.

### Handshaking

When a BotSocket client connects to a BotSocket server, it's expected that the client will send a `handshake` request, containing information for the server
about the client. The server will then send a `handshake` request back, containing information for the client about the server, such as confirmation data.

#### Client handshake

A `handshake` request from a client will have the `RequestType` of `handshake`, and its `data` structure, as defined by `ClientHandshakeData`, will have the following properties:

(optional properties are marked with a question mark '?')
* `userId`: required, the id of the user that the connected client is messaging on behalf of. This is used by the server to utilise user-specific information, and track the user through the Zwerm ecosystem.
* `timezone?`: optional, the timezone that the connected client is currently in.

Leafs can supplement a client handshake with the `supplementClientHandshake` method.

#### Server handshake

A `handshake` request from the server will have the `RequestType` of `handshake`, and its `data` structure, as defined by `ServerHandshakeData`, will have the following properties:

(optional properties are marked with a question mark '?')
* `userId`: required string; the id of the user that the connected client is considered to be representing by the server.
* `retryWaitTime`: required number; the number of seconds that the connected client should wait before trying to reconnect to the server, in the event of a disconnection

Note that if the `userId` property doesn't match the one sent by the client in its handshake, it means the server rejected that id for whatever reason.

This should be dealt with accordingly by the client, as it means that anything the client does will be considered by the server to be on behalf of the user
**the server** considers the client to be representing, regardless of what the client says or thinks. It's rare for a server to reject a client-provided user id.

Leafs can utilise the data sent by the servers handshake (such as to set a field) with the `processServerHandshake` method.

### Sending user queries

To submit a message from the user to the BotSocket server, you send a request of type `submit-query`, with the `data` property being a `StaMP` query message.

This can be done by calling the `CompositeBSClient#sendQuery` method.

Leafs can supplement a query being sent (such as to add timezone or location data) with the `supplementStaMPQuery` method.

### Sending client events

To submit an event from the client to the BotSocket server, you send a request of type `submit-event`, with the `data` property being a `StaMP` event message.

This can be done by calling the `CompositeBSClient#sendEvent` method.

Leafs can supplement a event being sent (such as to add timezone or location data) with the `supplementStaMPEvent` method.

### Rendering letters

When the server wants a client to deliver something to the user (such as some text or that the server or bot is 'thinking'), it'll send a `render-letter` request.

A `render-letter` request will have the `RequestType` of `render-letter`, and its `data` structure, as defined by `RenderLetterData`, will have the following properties:

(optional properties are marked with a question mark '?')
* `letter`: required `StaMP` letter; A `StaMP` letter containing `StaMP` messages to be rendered (whatever that might entail).

`CompositeBSClient` itself does nothing towards the rendering of `StaMP` letters. This functionality is implemented in leafs.

Leafs can process received `render-letter` requests with the `processRenderLetterRequest` method.
