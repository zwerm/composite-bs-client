# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2018-06-19

Some minor cleanup, automation, and fixes. Also added some warnings in the `userId` leafs
when the `userId` is set to a value that's not of type `string` or `null`.

This release removes the whole .idea folder,
which might mess-up this project in JetBrains IDEs.

You can fix this by just copying the deleted files from v0.1.1 to your .idea folder,
or by just deleting the project & re-checking it out again from source.

Sorry in advance - it's easier to rip the bandage off now, vs later down the line.

### Added
 - `npm version` script to help automate bits and bobs, making it easier & quicker to release.

### Changed
 - `AbstractUserIdLeaf` (& by inheritance child leafs) will now print a warning to the console
    when a supplement method encounters a `userId` value that's not `null` or of type `string`. ([66c7846])
 - `StaticUserIdLeaf` & `CookieUserIdLeaf` leafs will now print a warning to the console
    when their setters are provided a value that's not `null` or of type `string`. ([f76b871])
 - Made some minor grammatical corrections to, and removed trailing whitespace from,
    both the `README.md` and `CHANGELOG.md` files.

### Removed
 - `@stampit/stamp` optional dependency, as it screws over `npm` despite being optional.
    Once this package is released publicly, it'll be added back.
    You can fix unresolved typings by adding the package in your IDE or `package.json`.

## [0.1.1] - 2018-06-12

### Added
 - `private` & `engines` field to `package.json`, with a node engine requirement of +8

### Changed
 - Fixed package names in requires in code example in `README.md`

## 0.1.0 - 2018-06-12

### Added
 - Initial commit

[Unreleased]: https://github.com/zwerm/composite-bs-client/compare/v0.2.0...HEAD

[0.2.0]: https://github.com/zwerm/composite-bs-client/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/zwerm/composite-bs-client/compare/v0.1.0...v0.1.1

[66c7846]: https://github.com/Zwerm/composite-bs-client/commit/66c7846
[f76b871]: https://github.com/Zwerm/composite-bs-client/commit/f76b871
