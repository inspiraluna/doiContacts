// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const options = browserify.defaultOptions
  // print options to find babelify, it is inside transforms at index 1
  // and it is [filename, options]
  const babelOptions = options.browserifyOptions.transform[1][1]
  babelOptions.global = true
  // ignore all modules except files in lodash-es
  babelOptions.ignore = [/\/node_modules\/(?!doichain\/)/]
  // if you want to see the final options
  // console.log('%o', babelOptions)

  on('file:preprocessor', browserify(options))
}
