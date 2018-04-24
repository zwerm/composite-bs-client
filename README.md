# BotSocket Clients

A small collection of basic BotSocket (BS) web clients, that can be used as a starting point to build custom web clients
that can talk to BotSocket servers using StaMP.

The main client provided by this package is the `AbstractBSClient`.
This class in turn uses the `BSClientSocket` class to communicate right out of the box.

You simply extend from `AbstractBSClient`, or use the provided `EventBSClient`, and you're away laughing.
