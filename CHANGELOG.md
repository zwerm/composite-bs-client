# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
 - `AbstractUserIdLeaf` (& by inheritance child leafs) will now print a warning to the console
    when a supplement method encounters a `userId` value that's not `null` or of type `string`. ([66c7846])
 - `StaticUserIdLeaf` & `CookieUserIdLeaf` leafs will now print a warning to the console
    when their setters are provided a value that's not `null` or of type `string`. ([f76b871])

## [0.1.1] - 2018-06-12

### Added
 - `private` & `engines` field to `package.json`, with a node engine requirement of +8

### Changed
 - Fixed package names in requires in code example in `README.md`

## 0.1.0 - 2018-06-12

### Added
 - Initial commit

[Unreleased]: https://github.com/zwerm/composite-bs-client/compare/v0.1.1...HEAD

[0.1.1]: https://github.com/zwerm/composite-bs-client/compare/v0.1.0...v0.1.1

[66c7846]: https://github.com/Zwerm/composite-bs-client/commit/66c7846
[f76b871]: https://github.com/Zwerm/composite-bs-client/commit/f76b871
