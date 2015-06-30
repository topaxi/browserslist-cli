#!/usr/bin/env node

var browserslist = require('browserslist')
var agents       = require('caniuse-db/data').agents
var cmd          = require('commander')
var chalk        = require('chalk')
var query

cmd.version(require('../package.json').version)
   .option('-p, --path', 'Path to browserslist file [browserslist]', 'browserslist')
   .arguments('<browserslist...>')
   .action(function(queryValue) {
     query = queryValue.join(' ')
   })
   .parse(process.argv)

var browsers = browserslist(query, { path: cmd.path })

browsers.map(function(browserStr) {
  return browserStr.split(' ')
}).forEach(function(br) {
  var browser = br[0]
  var version = br[1]

  var usage = '(' + getGlobalUsage(browser, version).toFixed(2) + '% global usage)'

  console.log('%s%s %s',
    agents[browser].browser,
    // Chrome/Firefox/UC Browser don't have versions
    version === '0' ? '' : ' ' + version,
    chalk.dim(usage)
  )
})

function getGlobalUsage(browser, version) {
  if (version in agents[browser].usage_global) {
    return agents[browser].usage_global[version]
  }
  else { // No version match found, get latest version
    var keys = Object.keys(agents[browser].usage_global)

    if (keys.length) {
      return agents[browser].usage_global[keys.pop()]
    }
  }

  return 0
}
