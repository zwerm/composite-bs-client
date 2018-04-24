# BotSocket Clients

A small collection of basic BotSocket web clients, that can be used as a starting point to build custom web clients
that can talk to BotSocket servers using StaMP.

The main client provided by this package is the `AbstractBotSocketClient`.
This class in turn uses the `BotSocketClientSocket` class to communicate right out of the box.

You simply extend from `AbstractBotSocketClient`, or use the provided `EventBotSocketClient`, and you're away laughing.
