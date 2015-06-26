#!/usr/bin/env node

var browserslist = require('browserslist')
var agents       = require('caniuse-db/data').agents
var cmd          = require('commander')
var chalk        = require('chalk')
var query

cmd.version(require('./package.json').version)
   .option('-p, --path', 'Path to browserlist file [browserlist]', 'browserlist')
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
  var usage   = '(' + agents[browser].usage_global[version].toFixed(2) + ' global usage)'

  console.log('%s %s %s',
    agents[browser].browser,
    version,
    chalk.dim(usage)
  )
})
