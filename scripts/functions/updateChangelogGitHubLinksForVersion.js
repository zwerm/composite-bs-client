const /** @type {module:fs} */ fs = require('fs');

/**
 * Updates the `github` url links at the bottom of the `CHANGELOG.md`.
 *
 * It's assumed that the `githubRepoUrl` is all lowercase, and doesn't end with `.git`.
 *
 * It's assumed there is a blank newline between the [Unreleased] url & next version url.
 *
 * It's assumed that the git tag used will be `newVersionString` prefixed with a `v`,
 * per the usual behaviour of calling `npm version`.
 *
 * @param {string} newVersionString the version string used by the package in the `version` field of the `package.json`.
 * @param {string} githubRepoUrl url to the github repo, taking from the `repository.url` field of the `package.json`.
 * @param {string} changelogPath the path to the `CHANGELOG.md` file.
 */
const updateChangelogGitHubLinksForVersion = (newVersionString, githubRepoUrl, changelogPath) => {
    const oldChangelogFile = fs.readFileSync(changelogPath).toString();

    const newVersionTag = `v${newVersionString}`;

    const lastVersionCompareUrlStart = oldChangelogFile.indexOf('[', oldChangelogFile.lastIndexOf(`[Unreleased]: ${githubRepoUrl}/compare/`) + 1);
    const lastVersionCompareUrlEnd = oldChangelogFile.indexOf('\n', lastVersionCompareUrlStart);
    const lastVersionCompareUrl = oldChangelogFile.substring(lastVersionCompareUrlStart, lastVersionCompareUrlEnd);

    // const lastVersionString = lastVersionCompareUrl.substring(1, lastVersionCompareUrl.indexOf(']'));
    const lastVersionTag = lastVersionCompareUrl.substring(lastVersionCompareUrl.lastIndexOf('...') + '...'.length);

    const newChangelogFile = oldChangelogFile
        .replace(
            [
                `[Unreleased]: ${githubRepoUrl}/compare/${lastVersionTag}...HEAD`,
                null // there should be a blank line between the [Unreleased] url & the block of tag urls
            ].join('\n'), [
                `[Unreleased]: ${githubRepoUrl}/compare/${newVersionTag}...HEAD`,
                null, // there should be a blank line between the [Unreleased] url & the block of tag urls
                `[${newVersionString}]: ${githubRepoUrl}/compare/${lastVersionTag}...${newVersionTag}`
            ].join('\n')
        );

    fs.writeFileSync(changelogPath, newChangelogFile);
};

module.exports = updateChangelogGitHubLinksForVersion;
