# BotSocket Clients

A small collection of basic BotSocket (BS) web clients, that can be used as a starting point to build custom web clients
that can talk to BotSocket servers using StaMP.

The main client provided by this package is the `AbstractBSClient`.
This class in turn uses the `BSClientSocket` class to communicate right out of the box.

You simply extend from `AbstractBSClient`, or use the provided `EventBSClient`, and you're away laughing.

## Session Ids and You

The `userBotSessionId` is the most important property of the whole BotSocket client system.
BotSocket servers need a way to reference individual clients that are connected to them.

By default, the BotSocket server will provide connecting clients with a newly-generated `sessionId`,
as part of the BotSocket server's handshake.

If however a connecting BotSocket client includes the `session` GET parameter,
then that value will be used as the client's `sessionId`.

This is not something you provide yourself in the BotSocket server connection URL.
Instead, you pass the desired `sessionId` value to the `BSClientSocket#connect` 
& `BSClientSocket#reconnect` functions. 

As part of `AbstractBSClient`'s implementation, whenever a call to `BSClientSocket#connect()` or `BSClientSocket#reconnect()`
is made, the result of `get AbstractBSClient#userBotSessionId()` is passed as the `sessionId` parameter.

This makes controlling sessions easy, as you can simply override the getter & setter functions for `AbstractBSClient#userBotSessionId`.

For example, here's what a basic cookie-based session management implementation could look like:

```ecmascript 6
const Cookie = require('js-cookie');

class CookieBSClient extends EventBSClient {
    // region getters & setters
    /**
     *
     * @return {string}
     * @override
     */
    get userBotSessionId() {
        return Cookie.get('user-bot-session');
    }

    /**
     *
     * @param {string} session
     * @override
     */
    set userBotSessionId(session) {
        Cookie.set('user-bot-session', session, { path: '/', expires: 7 });
    }
    // endregion
}
```

`AbstractBSClient`'s default implementation of these methods uses the `AbstractBSClient#_userBotSessionId` field to
track clients session.

## API & Classes

### `BSClientSocket`

This class lies at the heart of BotSocket clients.

It manages the actual socket connection to the BotSocket server, emitting events where appropriate.
It also handles the initial handshaking with the server, passing it the sessionId as both a url parameter and in the client handshake.

When the socket opens, `BSClientSocket#E_SOCKET_OPEN` is emitted.  
When the socket closes, `BSClientSocket#E_SOCKET_CLOSE` is emitted.  
When the socket errors, `BSClientSocket#E_SOCKET_ERROR` is emitted.  
When the socket receives a new message, `BSClientSocket#E_SOCKET_MESSAGE` is emitted.  

### `AbstractBSClient`

This class provides a solid implementation for BotSocket clients to build off.

Out of the box, `AbstractBSClient` handles managing a `BSClientSocket` instance,
timed automatic reconnection, making calls to render status messages, and basic botUserSessionId tracking. 

When extending off `AbstractBSClient`, there are two abstract protected methods that must be implemented:
`AbstractBSClient#_renderStatusUpdate` & `AbstractBSClient#_renderLetter`.

##### `AbstractBSClient#_renderStatusUpdate(status, level)`

This method is passed a status message, and the level of that message.

Here's an example of this method in use in `AbstractBSClient#_reconnectCountdown()`: 
```ecmascript 6
/**
 * The countdown to when to attempt reconnection to the server
 *
 * @param {number} countdown
 * @private
 */
_reconnectCountdown(countdown) {
    if (countdown <= 0) {
        this._bsClientSocket.reconnect(this.userBotSessionId);
        this._renderStatusUpdate('reconnecting...', 'warning');
        
        return;
    }

    setTimeout(() => {
        const counter = countdown - 1;
        this._renderStatusUpdate(`connection lost, retrying in ${counter}...`, 'warning');

        this._reconnectCountdown(counter);
    }, 1000);
}
```

The possible values for the `level` parameter are defined in `BotSocket.StatusLevel` as:
```typescript
type StatusLevel =
    | 'info'
    | 'danger'
    | 'warning'
    | 'success'
    ;
```

##### `AbstractBSClient#_renderLetter(letter)`

This method is passed a StaMP letter, containing StaMP messages.

This method is called when the BotSocket server sends a request of type `render-letter`.

The implementation of these two methods depend greatly on the role of the BotSocket client, and it's operating environment.

For example, this package includes `EventBSClient`, who's implementation of the above two abstract methods
just emits them as events, like so:

```ecmascript 6
/**
 * @inheritDoc
 *
 * @param {string} status
 * @param {BotSocket.StatusLevel} level
 * @protected
 * @override
 */
_renderStatusUpdate(status, level) {
    this._emitRenderStatus(status, level);
}

/**
 * @inheritDoc
 *
 * @param {StaMP.Protocol.Letter} letter
 * @protected
 * @override
 */
_renderLetter(letter) {
    this._emitRenderLetter(letter);
}
``` 

One useful use-case for this client is in `React`, where composition is favored over inheritance. 
This makes it easy to build a BotSocket component, as you can just use `EventBSClient` and listen for it's events.

Meanwhile, a `Bootstrap`-based BotSocket client could implement the abstract methods 
so that they adjust the DOM directly using `jQuery`.

### `ClientMouth`

This class is an additional extra that can be used to quickly add support for playing speech from AWS Polly.

## TODO

- Add `ClientNotifier` class, that handles notifications. POC is done, just need to clean up.
- Refactor status messages a bit; we should either take a localisation map, or do something else.
- Refactor all `session` stuff to be `userBotSessionId`, asap.
- Consider defining a `SessionManager` interface/class, so that sessions can be handled with Dependency Injection pattern.
- Sort out `'senderClassification'` stuff, and add note about how to use `getMessageSenderClassification`.  
- Look into switching/converting to typescript?
