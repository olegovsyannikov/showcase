const semver = require('semver')
const packageJson = require('../package.json')

const version = packageJson.engines.node

if (!semver.satisfies(process.version, version)) {
  console.log(`Required node version ${version} not satisfied with current version ${process.version}.`); // eslint-disable-line
  process.exit(1)
}
