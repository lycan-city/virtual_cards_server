/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("node-uuid");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _bodyParser = __webpack_require__(0);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _nodeUuid = __webpack_require__(2);

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var app = (0, _express2.default)();

app.set('port', process.env.PORT || 3000);

var storage = {
  parties: {}
};

var fakeGame = {
  create: function create(players) {
    return [].concat(_toConsumableArray(Array(players).keys()));
  }
};

function shuffle(array) {
  var m = array.length,
      t,
      i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.get('/', function (req, res) {
  return res.json(storage);
});

app.post('/host', function (req, res) {
  var userId = req.body.userId || _nodeUuid2.default.v4();
  var partyId = _nodeUuid2.default.v4();
  storage.parties[partyId] = {
    host: userId,
    players: []
  };
  res.json({
    partyId: partyId,
    userId: userId
  });
});

app.post('/start', function (req, res) {
  var partyId = req.body.partyId;
  if (!partyId) return res.status(400).json({ error: 'partyId cannot be undefined' });

  if (!storage.parties[partyId]) return res.status(400).json({ error: 'no party with id ' + partyId + ' found' });

  var party = shuffle(fakeGame.create(storage.parties[partyId].players.length));

  storage.parties[partyId].players.forEach(function (p, i) {
    return p.card = party[i];
  });

  res.json(storage.parties[partyId]);
});

app.post('/join', function (req, res) {
  console.log(req);
  if (!req.body.partyId) return res.status(400).json({ error: 'partyId cannot be undefined' });

  if (!storage.parties[req.body.partyId]) return res.status(400).json({ error: 'no party with id ' + req.body.partyId + ' found' });

  var userId = req.body.userId || _nodeUuid2.default.v4();

  storage.parties[req.body.partyId].players.push({ id: userId });

  res.json({
    userId: userId,
    party: storage.parties[req.body.partyId]
  });
});

app.listen(app.get('port'));

console.log('http://localhost:' + app.get('port'));

/***/ })
/******/ ]);