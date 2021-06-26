const { gitDescribeSync } = require('git-describe')

process.env.VUE_APP_VERSION = process.env.npm_package_version
process.env.VUE_APP_GIT_HASH = gitDescribeSync().hash

module.exports = {
  pwa: {
    name: 'Toshokan',
    themeColor: '#673AB7'
  }
}
