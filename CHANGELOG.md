# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2019-04-05

### Added
 - `AbstractRendererLeaf#archiver` setter, for the private `#_archiver` property.
 - `AbstractRendererLeaf#_renderArchiverRequests` method; this method encapsulates code previously called in `#postHandshake`,
 opening it up to be overridden by child classes.
 - `AbstractRendererLeaf#_getArchiverRequestsToRender` method; this method encapsulates code previously called in `#postHandshake` (& then `#_renderArchiverRequests`),
  opening it up to be overridden by child classes.

### Changed
 - `ConversationDataIncluderLeaf` now supports persisting via `sessionStorage.`
 This is enabled by default, but can be disabled with a constructor parameter.

## [0.7.0] - 2018-08-14

This release adds a couple of new abstract leafs for persisting & rendering messages,
as well as fixes a bug that was causing an error to be thrown in Safari when using the `TalkingLeaf`, 
that'd result in the whole client (and usually surrounding app, depending on usage & implementation) to stop working.

### Added
 - `AbstractArchiverLeaf` - Abstract class for archiving leafs, that provide a means to store & retrieve messages of types.
 - `SessionStorageArchiverLeaf` - an archiving leaf that stores messages using the `sessionStorage` api.
 - `AbstractRendererLeaf` - Abstract class for rendering leafs, that provide a means of rendering messages, and optionally take an `Archiver` as their
    first parameter, that they can use to display previously sent messages.
 - `DebugRendererLeaf` - a rendering leaf that 'renders' all messages to the console via `debug`.

### Changed
 - `TalkingLeaf` no longer instances a new `AudioContext` as the default value for it's `audioContext` constructor parameter.
    `ClientMouth` already does this, but checks if `AudioContext` is actually supported first, meaning we can just remove the
    default parameter, rather than perform the check twice.

## [0.6.2] - 2018-08-02

### Changed
 - Fixed `ConversationDataIncluderLeaf` using the wrong property for setting the context (was `conversationContext` and now correctly uses `context`). 
 
## [0.6.1] - 2018-07-25

### Changed
 - Fixed `ConversationDataIncluderLeaf` attempting to call a method that isn't defined on it's class.

## [0.6.0] - 2018-07-25

### Added
 - New Leaf: `ConversationDataIncluderLeaf`, which allows easy including of the store & context of a conversation in every sent message.

## [0.5.0] - 2018-07-24

### Added
 - `SendInputQueryOnFormSubmitLeaf` export to `index.js`.
 - `ToggleDisabledOnConnectLeaf` export to `index.js`.
 - `ScrollToPositionOnLetterLeaf` export to `index.js`.
 - `SessionStorageUserIdLeaf` export to `index.js`.
 - `e:status.handshake` event to `EmitStatusMessageEventsLeaf`, which is emitted whenever `postHandshake` is called.

## [0.4.0] - 2018-07-24

### Added
 - New Leaf: `SessionStorageUserIdLeaf`, which uses [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
   to persist a `userId`.

### Changed
 - `CookieUserIdLeaf` now takes a time in milliseconds as it's second constructor parameter to use as
    the expiration time for the cookie it sets. This defaults to a value of 7 days.

## [0.3.0] - 2018-07-23

### Changed
 - Replaced calls to `console` with calls to `debug`. Namespaces are `<package-name>:<class-name>`
 - Replaced usage of object spread operator in `SendEventOnHandshakeLeaf` with `Object.assign`,
   as it just makes life easier when use `babel` (since it's technically still a proposal).
 - `SendEventOnHandshakeLeaf` now takes an object as it's third constructor parameter: `data`.
 - `CompositeBSClient`s `sendQuery` & `sendEvent` methods now use their `data` parameter properly.

## [0.2.0] - 2018-06-19

Some minor cleanup, automation, and fixes. Also added some warnings in the `userId` leafs
when the `userId` is set to a value that's not of type `string` or `null`.

This release removes the whole .idea folder,
which might mess-up this project in JetBrains IDEs.

You can fix this by just copying the deleted files from v0.1.1 to your .idea folder,
or by just deleting the project & re-checking it out again from source.

Sorry in advance - it's easier to rip the bandage off now, vs later down the line.

### Added
 - `npm version` script to help automate bits and bobs, making it easier & quicker to release. ([73bc733])

### Changed
 - `AbstractUserIdLeaf` (& by inheritance child leafs) will now print a warning to the console
    when a supplement method encounters a `userId` value that's not `null` or of type `string`. ([66c7846])
 - `StaticUserIdLeaf` & `CookieUserIdLeaf` leafs will now print a warning to the console
    when their setters are provided a value that's not `null` or of type `string`. ([f76b871])
 - Made some minor grammatical corrections to, and removed trailing whitespace from,
    both the `README.md` and `CHANGELOG.md` files. ([a28b471], [f45b923])

### Removed
 - `@stampit/stamp` optional dependency, as it screws over `npm` despite being optional.
    Once this package is released publicly, it'll be added back.
    You can fix unresolved typings by adding the package in your IDE or `package.json`.

## [0.1.1] - 2018-06-12

### Added
 - `private` & `engines` fields to `package.json`, with a node engine requirement of +8. ([8376e73])

### Changed
 - Fixed package names in requires in code example in `README.md`. ([8825631])

## 0.1.0 - 2018-06-12

### Added
 - Initial commit

[Unreleased]: https://github.com/zwerm/composite-bs-client/compare/v0.8.0...HEAD

[0.8.0]: https://github.com/zwerm/composite-bs-client/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/zwerm/composite-bs-client/compare/v0.6.3...v0.7.0
[0.6.3]: https://github.com/zwerm/composite-bs-client/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/zwerm/composite-bs-client/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/zwerm/composite-bs-client/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/zwerm/composite-bs-client/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/zwerm/composite-bs-client/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/zwerm/composite-bs-client/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/zwerm/composite-bs-client/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/zwerm/composite-bs-client/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/zwerm/composite-bs-client/compare/v0.1.0...v0.1.1

[73bc733]: https://github.com/Zwerm/composite-bs-client/commit/73bc733
[66c7846]: https://github.com/Zwerm/composite-bs-client/commit/66c7846
[f76b871]: https://github.com/Zwerm/composite-bs-client/commit/f76b871
[f45b923]: https://github.com/Zwerm/composite-bs-client/commit/f45b923
[a28b471]: https://github.com/Zwerm/composite-bs-client/commit/a28b471
[8376e73]: https://github.com/Zwerm/composite-bs-client/commit/8376e73
[8825631]: https://github.com/Zwerm/composite-bs-client/commit/8825631
