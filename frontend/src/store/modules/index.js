/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Register each file as a corresponding Vuex module. Module nesting
// will mirror [sub-]directory hierarchy and modules are namespaced
// as the camelCase equivalent of their file name.

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://webpack.js.org/guides/dependency-management/#require-context
var requireModule = require.context(
// Search for files in the current directory
'.',
// Search for files in subdirectories
true,
// Include any .js files that are not unit tests
/^((?!\.unit\.).)*\.js$/);
var root = { modules: {} };

requireModule.keys().forEach(function (fileName) {
  // Skip this file, as it's not a module
  if (fileName === './index.js') return;

  // Get the module path as an array
  var modulePath = fileName
  // Remove the "./" from the beginning
  .replace(/^\.\//, '')
  // Remove .store from the file name
  .replace('.store', '')
  // Remove the file extension from the end
  .replace(/\.\w+$/, '')
  // Split nested modules into an array path
  .split(/\//)
  // camelCase all module namespaces and names
  .map(_camelCase2.default);

  // Get the modules object for the current path

  var _getNamespace = getNamespace(root, modulePath),
      modules = _getNamespace.modules;

  // Add the module to our modules object


  modules[modulePath.pop()] = _extends({
    // Modules are namespaced by default
    namespaced: true
  }, requireModule(fileName));

  // Recursively get the namespace of the module, even if nested
  function getNamespace(subtree, path) {
    if (path.length === 1) return subtree;

    var namespace = path.shift();
    subtree.modules[namespace] = _extends({ modules: {} }, subtree.modules[namespace]);
    return getNamespace(subtree.modules[namespace], path);
  }
});

exports.default = root.modules;
