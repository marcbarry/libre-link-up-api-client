"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibreLinkUpClient = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _utils = require("./utils");

var LIBRE_LINK_SERVER = 'https://api-us.libreview.io';
var urlMap = {
  login: '/llu/auth/login',
  connections: '/llu/connections',
  countries: '/llu/config/country?country=DE'
};

var LibreLinkUpClient = function LibreLinkUpClient(_ref) {
  var username = _ref.username,
      password = _ref.password,
      version = _ref.version,
      connectionIdentifier = _ref.connectionIdentifier;
  var jwtToken = null;
  var connectionId = null;

  var instance = _axios["default"].create({
    baseURL: LIBRE_LINK_SERVER,
    headers: {
      'accept-encoding': 'gzip',
      'cache-control': 'no-cache',
      connection: 'Keep-Alive',
      'content-type': 'application/json',
      product: 'llu.android',
      version: version
    }
  });

  instance.interceptors.request.use(function (config) {
    if (jwtToken && config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers.authorization = "Bearer ".concat(jwtToken);
    }

    return config;
  }, function (e) {
    return e;
  }, {
    synchronous: true
  });

  var login = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var loginResponse, redirectResponse, countryNodes, targetRegion, regionDefinition;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return instance.post(urlMap.login, {
                email: username,
                password: password
              });

            case 2:
              loginResponse = _context.sent;

              if (!(loginResponse.data.status === 2)) {
                _context.next = 5;
                break;
              }

              throw new Error('Bad credentials. Please ensure that you have entered the credentials of your LibreLinkUp account (and not of your LibreLink account).');

            case 5:
              if (!loginResponse.data.data.redirect) {
                _context.next = 16;
                break;
              }

              redirectResponse = loginResponse.data;
              _context.next = 9;
              return instance.get(urlMap.countries);

            case 9:
              countryNodes = _context.sent;
              targetRegion = redirectResponse.data.region;
              regionDefinition = countryNodes.data.data.regionalMap[targetRegion];

              if (regionDefinition) {
                _context.next = 14;
                break;
              }

              throw new Error("Unable to find region '".concat(redirectResponse.data.region, "'. \n          Available nodes are ").concat(Object.keys(countryNodes.data.data.regionalMap).join(', '), "."));

            case 14:
              instance.defaults.baseURL = regionDefinition.lslApi;
              return _context.abrupt("return", login());

            case 16:
              jwtToken = loginResponse.data.data.authTicket.token;
              return _context.abrupt("return", loginResponse.data);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function login() {
      return _ref2.apply(this, arguments);
    };
  }();

  var loginWrapper = function loginWrapper(func) {
    return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;

              if (jwtToken) {
                _context2.next = 4;
                break;
              }

              _context2.next = 4;
              return login();

            case 4:
              return _context2.abrupt("return", func());

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              _context2.next = 11;
              return login();

            case 11:
              return _context2.abrupt("return", func());

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));
  };

  var getConnections = loginWrapper( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return instance.get(urlMap.connections);

          case 2:
            response = _context3.sent;
            return _context3.abrupt("return", response.data);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));

  var getConnection = function getConnection(connections) {
    if (typeof connectionIdentifier === 'string') {
      var match = connections.find(function (_ref5) {
        var firstName = _ref5.firstName,
            lastName = _ref5.lastName;
        return "".concat(firstName, " ").concat(lastName).toLowerCase() === connectionIdentifier.toLowerCase();
      });

      if (!match) {
        throw new Error("Unable to identify connection by given name '".concat(connectionIdentifier, "'."));
      }

      return match.patientId;
    }

    if (typeof connectionIdentifier === 'function') {
      var _match = connectionIdentifier.call(null, connections);

      if (!_match) {
        throw new Error("Unable to identify connection by given name function");
      }

      return _match;
    }

    return connections[0].patientId;
  };

  var readRaw = loginWrapper( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var _connections, response;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (connectionId) {
              _context4.next = 5;
              break;
            }

            _context4.next = 3;
            return getConnections();

          case 3:
            _connections = _context4.sent;
            connectionId = getConnection(_connections.data);

          case 5:
            _context4.next = 7;
            return instance.get("".concat(urlMap.connections, "/").concat(connectionId, "/graph"));

          case 7:
            response = _context4.sent;
            return _context4.abrupt("return", response.data.data);

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));

  var read = /*#__PURE__*/function () {
    var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var response;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return readRaw();

            case 2:
              response = _context5.sent;
              return _context5.abrupt("return", {
                current: (0, _utils.mapData)(response.connection.glucoseMeasurement),
                history: response.graphData.map(_utils.mapData)
              });

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function read() {
      return _ref7.apply(this, arguments);
    };
  }();

  var observe = /*#__PURE__*/function () {
    var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function observe() {
      return _ref8.apply(this, arguments);
    };
  }();

  var averageInterval;

  var readAveraged = /*#__PURE__*/function () {
    var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(amount, callback) {
      var interval,
          mem,
          _args8 = arguments;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              interval = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 15000;
              mem = new Map();
              averageInterval = setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
                var _yield$read, current, history, memValues, averageValue, averageTrend;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return read();

                      case 2:
                        _yield$read = _context7.sent;
                        current = _yield$read.current;
                        history = _yield$read.history;
                        mem.set(current.date.toString(), current);

                        if (mem.size === amount) {
                          memValues = Array.from(mem.values());
                          averageValue = Math.round(memValues.reduce(function (acc, cur) {
                            return acc + cur.value;
                          }, 0) / amount);
                          averageTrend = _utils.trendMap[parseInt((Math.round(memValues.reduce(function (acc, cur) {
                            return acc + _utils.trendMap.indexOf(cur.trend);
                          }, 0) / amount * 100) / 100).toFixed(0), 10)];
                          mem = new Map();
                          callback.apply(null, [{
                            trend: averageTrend,
                            value: averageValue,
                            date: current.date,
                            isHigh: current.isHigh,
                            isLow: current.isLow
                          }, memValues, history]);
                        }

                      case 7:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              })), interval);
              return _context8.abrupt("return", function () {
                return clearInterval(averageInterval);
              });

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));

    return function readAveraged(_x, _x2) {
      return _ref9.apply(this, arguments);
    };
  }();

  return {
    observe: observe,
    readRaw: readRaw,
    read: read,
    readAveraged: readAveraged,
    login: login
  };
};

exports.LibreLinkUpClient = LibreLinkUpClient;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJMSUJSRV9MSU5LX1NFUlZFUiIsInVybE1hcCIsImxvZ2luIiwiY29ubmVjdGlvbnMiLCJjb3VudHJpZXMiLCJMaWJyZUxpbmtVcENsaWVudCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJ2ZXJzaW9uIiwiY29ubmVjdGlvbklkZW50aWZpZXIiLCJqd3RUb2tlbiIsImNvbm5lY3Rpb25JZCIsImluc3RhbmNlIiwiYXhpb3MiLCJjcmVhdGUiLCJiYXNlVVJMIiwiaGVhZGVycyIsImNvbm5lY3Rpb24iLCJwcm9kdWN0IiwiaW50ZXJjZXB0b3JzIiwicmVxdWVzdCIsInVzZSIsImNvbmZpZyIsImF1dGhvcml6YXRpb24iLCJlIiwic3luY2hyb25vdXMiLCJwb3N0IiwiZW1haWwiLCJsb2dpblJlc3BvbnNlIiwiZGF0YSIsInN0YXR1cyIsIkVycm9yIiwicmVkaXJlY3QiLCJyZWRpcmVjdFJlc3BvbnNlIiwiZ2V0IiwiY291bnRyeU5vZGVzIiwidGFyZ2V0UmVnaW9uIiwicmVnaW9uIiwicmVnaW9uRGVmaW5pdGlvbiIsInJlZ2lvbmFsTWFwIiwiT2JqZWN0Iiwia2V5cyIsImpvaW4iLCJkZWZhdWx0cyIsImxzbEFwaSIsImF1dGhUaWNrZXQiLCJ0b2tlbiIsImxvZ2luV3JhcHBlciIsImZ1bmMiLCJnZXRDb25uZWN0aW9ucyIsInJlc3BvbnNlIiwiZ2V0Q29ubmVjdGlvbiIsIm1hdGNoIiwiZmluZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwidG9Mb3dlckNhc2UiLCJwYXRpZW50SWQiLCJjYWxsIiwicmVhZFJhdyIsInJlYWQiLCJjdXJyZW50IiwibWFwRGF0YSIsImdsdWNvc2VNZWFzdXJlbWVudCIsImhpc3RvcnkiLCJncmFwaERhdGEiLCJtYXAiLCJvYnNlcnZlIiwiYXZlcmFnZUludGVydmFsIiwicmVhZEF2ZXJhZ2VkIiwiYW1vdW50IiwiY2FsbGJhY2siLCJpbnRlcnZhbCIsIm1lbSIsIk1hcCIsInNldEludGVydmFsIiwic2V0IiwiZGF0ZSIsInRvU3RyaW5nIiwic2l6ZSIsIm1lbVZhbHVlcyIsIkFycmF5IiwiZnJvbSIsInZhbHVlcyIsImF2ZXJhZ2VWYWx1ZSIsIk1hdGgiLCJyb3VuZCIsInJlZHVjZSIsImFjYyIsImN1ciIsInZhbHVlIiwiYXZlcmFnZVRyZW5kIiwidHJlbmRNYXAiLCJwYXJzZUludCIsImluZGV4T2YiLCJ0cmVuZCIsInRvRml4ZWQiLCJhcHBseSIsImlzSGlnaCIsImlzTG93IiwiY2xlYXJJbnRlcnZhbCJdLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCB7IExpYnJlQ2dtRGF0YSB9IGZyb20gJy4vdHlwZXMvY2xpZW50JztcbmltcG9ydCB7IEFjdGl2ZVNlbnNvciwgQ29ubmVjdGlvbiwgR2x1Y29zZUl0ZW0gfSBmcm9tICcuL3R5cGVzL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnNSZXNwb25zZSwgRGF0dW0gfSBmcm9tICcuL3R5cGVzL2Nvbm5lY3Rpb25zJztcbmltcG9ydCB7IENvdW50cnlSZXNwb25zZSwgQUUsIFJlZ2lvbmFsTWFwIH0gZnJvbSAnLi90eXBlcy9jb3VudHJpZXMnO1xuaW1wb3J0IHsgR3JhcGhEYXRhIH0gZnJvbSAnLi90eXBlcy9ncmFwaCc7XG5pbXBvcnQgeyBMb2dpblJlc3BvbnNlLCBMb2dpblJlZGlyZWN0UmVzcG9uc2UgfSBmcm9tICcuL3R5cGVzL2xvZ2luJztcbmltcG9ydCB7IG1hcERhdGEsIHRyZW5kTWFwIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IExJQlJFX0xJTktfU0VSVkVSID0gJ2h0dHBzOi8vYXBpLXVzLmxpYnJldmlldy5pbyc7XG5cbnR5cGUgQ2xpZW50QXJncyA9IHtcbiAgdXNlcm5hbWU6IHN0cmluZztcbiAgcGFzc3dvcmQ6IHN0cmluZztcbiAgdmVyc2lvbjogc3RyaW5nO1xuICBjb25uZWN0aW9uSWRlbnRpZmllcj86IHN0cmluZyB8ICgoY29ubmVjdGlvbnM6IERhdHVtW10pID0+IHN0cmluZyk7XG59O1xuXG50eXBlIFJlYWRSYXdSZXNwb25zZSA9IHtcbiAgY29ubmVjdGlvbjogQ29ubmVjdGlvbjtcbiAgYWN0aXZlU2Vuc29yczogQWN0aXZlU2Vuc29yW107XG4gIGdyYXBoRGF0YTogR2x1Y29zZUl0ZW1bXTtcbn07XG5cbnR5cGUgUmVhZFJlc3BvbnNlID0ge1xuICBjdXJyZW50OiBMaWJyZUNnbURhdGE7XG4gIGhpc3Rvcnk6IExpYnJlQ2dtRGF0YVtdO1xufTtcblxuY29uc3QgdXJsTWFwID0ge1xuICBsb2dpbjogJy9sbHUvYXV0aC9sb2dpbicsXG4gIGNvbm5lY3Rpb25zOiAnL2xsdS9jb25uZWN0aW9ucycsXG4gIGNvdW50cmllczogJy9sbHUvY29uZmlnL2NvdW50cnk/Y291bnRyeT1ERScsXG59O1xuXG5leHBvcnQgY29uc3QgTGlicmVMaW5rVXBDbGllbnQgPSAoe1xuICB1c2VybmFtZSxcbiAgcGFzc3dvcmQsXG4gIHZlcnNpb24sXG4gIGNvbm5lY3Rpb25JZGVudGlmaWVyLFxufTogQ2xpZW50QXJncykgPT4ge1xuICBsZXQgand0VG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBsZXQgY29ubmVjdGlvbklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBjb25zdCBpbnN0YW5jZSA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgYmFzZVVSTDogTElCUkVfTElOS19TRVJWRVIsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ2FjY2VwdC1lbmNvZGluZyc6ICdnemlwJyxcbiAgICAgICdjYWNoZS1jb250cm9sJzogJ25vLWNhY2hlJyxcbiAgICAgIGNvbm5lY3Rpb246ICdLZWVwLUFsaXZlJyxcbiAgICAgICdjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBwcm9kdWN0OiAnbGx1LmFuZHJvaWQnLFxuICAgICAgdmVyc2lvbixcbiAgICB9LFxuICB9KTtcbiAgaW5zdGFuY2UuaW50ZXJjZXB0b3JzLnJlcXVlc3QudXNlKFxuICAgIGNvbmZpZyA9PiB7XG4gICAgICBpZiAoand0VG9rZW4gJiYgY29uZmlnLmhlYWRlcnMpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gICAgICAgIGNvbmZpZy5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7and0VG9rZW59YDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9LFxuICAgIGUgPT4gZSxcbiAgICB7IHN5bmNocm9ub3VzOiB0cnVlIH1cbiAgKTtcblxuICBjb25zdCBsb2dpbiA9IGFzeW5jICgpOiBQcm9taXNlPExvZ2luUmVzcG9uc2U+ID0+IHtcbiAgICBjb25zdCBsb2dpblJlc3BvbnNlID0gYXdhaXQgaW5zdGFuY2UucG9zdDxcbiAgICAgIExvZ2luUmVzcG9uc2UgfCBMb2dpblJlZGlyZWN0UmVzcG9uc2VcbiAgICA+KHVybE1hcC5sb2dpbiwge1xuICAgICAgZW1haWw6IHVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQsXG4gICAgfSk7XG5cbiAgICBpZiAobG9naW5SZXNwb25zZS5kYXRhLnN0YXR1cyA9PT0gMilcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0JhZCBjcmVkZW50aWFscy4gUGxlYXNlIGVuc3VyZSB0aGF0IHlvdSBoYXZlIGVudGVyZWQgdGhlIGNyZWRlbnRpYWxzIG9mIHlvdXIgTGlicmVMaW5rVXAgYWNjb3VudCAoYW5kIG5vdCBvZiB5b3VyIExpYnJlTGluayBhY2NvdW50KS4nXG4gICAgICApO1xuXG4gICAgaWYgKChsb2dpblJlc3BvbnNlLmRhdGEgYXMgTG9naW5SZWRpcmVjdFJlc3BvbnNlKS5kYXRhLnJlZGlyZWN0KSB7XG4gICAgICBjb25zdCByZWRpcmVjdFJlc3BvbnNlID0gbG9naW5SZXNwb25zZS5kYXRhIGFzIExvZ2luUmVkaXJlY3RSZXNwb25zZTtcbiAgICAgIGNvbnN0IGNvdW50cnlOb2RlcyA9IGF3YWl0IGluc3RhbmNlLmdldDxDb3VudHJ5UmVzcG9uc2U+KFxuICAgICAgICB1cmxNYXAuY291bnRyaWVzXG4gICAgICApO1xuICAgICAgY29uc3QgdGFyZ2V0UmVnaW9uID0gcmVkaXJlY3RSZXNwb25zZS5kYXRhLnJlZ2lvbiBhcyBrZXlvZiBSZWdpb25hbE1hcDtcbiAgICAgIGNvbnN0IHJlZ2lvbkRlZmluaXRpb246IEFFIHwgdW5kZWZpbmVkID1cbiAgICAgICAgY291bnRyeU5vZGVzLmRhdGEuZGF0YS5yZWdpb25hbE1hcFt0YXJnZXRSZWdpb25dO1xuXG4gICAgICBpZiAoIXJlZ2lvbkRlZmluaXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBVbmFibGUgdG8gZmluZCByZWdpb24gJyR7cmVkaXJlY3RSZXNwb25zZS5kYXRhLnJlZ2lvbn0nLiBcbiAgICAgICAgICBBdmFpbGFibGUgbm9kZXMgYXJlICR7T2JqZWN0LmtleXMoXG4gICAgICAgICAgICBjb3VudHJ5Tm9kZXMuZGF0YS5kYXRhLnJlZ2lvbmFsTWFwXG4gICAgICAgICAgKS5qb2luKCcsICcpfS5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGluc3RhbmNlLmRlZmF1bHRzLmJhc2VVUkwgPSByZWdpb25EZWZpbml0aW9uLmxzbEFwaTtcbiAgICAgIHJldHVybiBsb2dpbigpO1xuICAgIH1cbiAgICBqd3RUb2tlbiA9IChsb2dpblJlc3BvbnNlLmRhdGEgYXMgTG9naW5SZXNwb25zZSkuZGF0YS5hdXRoVGlja2V0LnRva2VuO1xuXG4gICAgcmV0dXJuIGxvZ2luUmVzcG9uc2UuZGF0YSBhcyBMb2dpblJlc3BvbnNlO1xuICB9O1xuXG4gIGNvbnN0IGxvZ2luV3JhcHBlciA9XG4gICAgPFJldHVybj4oZnVuYzogKCkgPT4gUHJvbWlzZTxSZXR1cm4+KSA9PlxuICAgIGFzeW5jICgpOiBQcm9taXNlPFJldHVybj4gPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFqd3RUb2tlbikgYXdhaXQgbG9naW4oKTtcbiAgICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgYXdhaXQgbG9naW4oKTtcbiAgICAgICAgcmV0dXJuIGZ1bmMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gIGNvbnN0IGdldENvbm5lY3Rpb25zID0gbG9naW5XcmFwcGVyPENvbm5lY3Rpb25zUmVzcG9uc2U+KGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldDxDb25uZWN0aW9uc1Jlc3BvbnNlPihcbiAgICAgIHVybE1hcC5jb25uZWN0aW9uc1xuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfSk7XG5cbiAgY29uc3QgZ2V0Q29ubmVjdGlvbiA9IChjb25uZWN0aW9uczogRGF0dW1bXSk6IHN0cmluZyA9PiB7XG4gICAgaWYgKHR5cGVvZiBjb25uZWN0aW9uSWRlbnRpZmllciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY29ubmVjdGlvbnMuZmluZChcbiAgICAgICAgKHsgZmlyc3ROYW1lLCBsYXN0TmFtZSB9KSA9PlxuICAgICAgICAgIGAke2ZpcnN0TmFtZX0gJHtsYXN0TmFtZX1gLnRvTG93ZXJDYXNlKCkgPT09XG4gICAgICAgICAgY29ubmVjdGlvbklkZW50aWZpZXIudG9Mb3dlckNhc2UoKVxuICAgICAgKTtcblxuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYFVuYWJsZSB0byBpZGVudGlmeSBjb25uZWN0aW9uIGJ5IGdpdmVuIG5hbWUgJyR7Y29ubmVjdGlvbklkZW50aWZpZXJ9Jy5gXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYXRjaC5wYXRpZW50SWQ7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29ubmVjdGlvbklkZW50aWZpZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY29ubmVjdGlvbklkZW50aWZpZXIuY2FsbChudWxsLCBjb25uZWN0aW9ucyk7XG5cbiAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gaWRlbnRpZnkgY29ubmVjdGlvbiBieSBnaXZlbiBuYW1lIGZ1bmN0aW9uYCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29ubmVjdGlvbnNbMF0ucGF0aWVudElkO1xuICB9O1xuXG4gIGNvbnN0IHJlYWRSYXcgPSBsb2dpbldyYXBwZXI8UmVhZFJhd1Jlc3BvbnNlPihhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFjb25uZWN0aW9uSWQpIHtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb25zID0gYXdhaXQgZ2V0Q29ubmVjdGlvbnMoKTtcblxuICAgICAgY29ubmVjdGlvbklkID0gZ2V0Q29ubmVjdGlvbihjb25uZWN0aW9ucy5kYXRhKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGluc3RhbmNlLmdldDxHcmFwaERhdGE+KFxuICAgICAgYCR7dXJsTWFwLmNvbm5lY3Rpb25zfS8ke2Nvbm5lY3Rpb25JZH0vZ3JhcGhgXG4gICAgKTtcblxuICAgIHJldHVybiByZXNwb25zZS5kYXRhLmRhdGE7XG4gIH0pO1xuXG4gIGNvbnN0IHJlYWQgPSBhc3luYyAoKTogUHJvbWlzZTxSZWFkUmVzcG9uc2U+ID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJlYWRSYXcoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBtYXBEYXRhKHJlc3BvbnNlLmNvbm5lY3Rpb24uZ2x1Y29zZU1lYXN1cmVtZW50KSxcbiAgICAgIGhpc3Rvcnk6IHJlc3BvbnNlLmdyYXBoRGF0YS5tYXAobWFwRGF0YSksXG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBvYnNlcnZlID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEB0b2RvXG4gIH07XG5cbiAgbGV0IGF2ZXJhZ2VJbnRlcnZhbDogTm9kZUpTLlRpbWVyO1xuICBjb25zdCByZWFkQXZlcmFnZWQgPSBhc3luYyAoXG4gICAgYW1vdW50OiBudW1iZXIsXG4gICAgY2FsbGJhY2s6IChcbiAgICAgIGF2ZXJhZ2U6IExpYnJlQ2dtRGF0YSxcbiAgICAgIG1lbW9yeTogTGlicmVDZ21EYXRhW10sXG4gICAgICBoaXN0b3J5OiBMaWJyZUNnbURhdGFbXVxuICAgICkgPT4gdm9pZCxcbiAgICBpbnRlcnZhbCA9IDE1MDAwXG4gICkgPT4ge1xuICAgIGxldCBtZW06IE1hcDxzdHJpbmcsIExpYnJlQ2dtRGF0YT4gPSBuZXcgTWFwKCk7XG5cbiAgICBhdmVyYWdlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnQsIGhpc3RvcnkgfSA9IGF3YWl0IHJlYWQoKTtcbiAgICAgIG1lbS5zZXQoY3VycmVudC5kYXRlLnRvU3RyaW5nKCksIGN1cnJlbnQpO1xuXG4gICAgICBpZiAobWVtLnNpemUgPT09IGFtb3VudCkge1xuICAgICAgICBjb25zdCBtZW1WYWx1ZXMgPSBBcnJheS5mcm9tKG1lbS52YWx1ZXMoKSk7XG4gICAgICAgIGNvbnN0IGF2ZXJhZ2VWYWx1ZSA9IE1hdGgucm91bmQoXG4gICAgICAgICAgbWVtVmFsdWVzLnJlZHVjZSgoYWNjLCBjdXIpID0+IGFjYyArIGN1ci52YWx1ZSwgMCkgLyBhbW91bnRcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYXZlcmFnZVRyZW5kID1cbiAgICAgICAgICB0cmVuZE1hcFtcbiAgICAgICAgICAgIHBhcnNlSW50KFxuICAgICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChcbiAgICAgICAgICAgICAgICAgIChtZW1WYWx1ZXMucmVkdWNlKFxuICAgICAgICAgICAgICAgICAgICAoYWNjLCBjdXIpID0+IGFjYyArIHRyZW5kTWFwLmluZGV4T2YoY3VyLnRyZW5kKSxcbiAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICAgKSAvXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudCkgKlxuICAgICAgICAgICAgICAgICAgICAxMDBcbiAgICAgICAgICAgICAgICApIC8gMTAwXG4gICAgICAgICAgICAgICkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICAgMTBcbiAgICAgICAgICAgIClcbiAgICAgICAgICBdO1xuXG4gICAgICAgIG1lbSA9IG5ldyBNYXAoKTtcbiAgICAgICAgY2FsbGJhY2suYXBwbHkobnVsbCwgW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRyZW5kOiBhdmVyYWdlVHJlbmQsXG4gICAgICAgICAgICB2YWx1ZTogYXZlcmFnZVZhbHVlLFxuICAgICAgICAgICAgZGF0ZTogY3VycmVudC5kYXRlLFxuICAgICAgICAgICAgaXNIaWdoOiBjdXJyZW50LmlzSGlnaCxcbiAgICAgICAgICAgIGlzTG93OiBjdXJyZW50LmlzTG93LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVtVmFsdWVzLFxuICAgICAgICAgIGhpc3RvcnksXG4gICAgICAgIF0pO1xuICAgICAgfVxuICAgIH0sIGludGVydmFsKTtcblxuICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKGF2ZXJhZ2VJbnRlcnZhbCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBvYnNlcnZlLFxuICAgIHJlYWRSYXcsXG4gICAgcmVhZCxcbiAgICByZWFkQXZlcmFnZWQsXG4gICAgbG9naW4sXG4gIH07XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBT0E7O0FBRUEsSUFBTUEsaUJBQWlCLEdBQUcsNkJBQTFCO0FBb0JBLElBQU1DLE1BQU0sR0FBRztFQUNiQyxLQUFLLEVBQUUsaUJBRE07RUFFYkMsV0FBVyxFQUFFLGtCQUZBO0VBR2JDLFNBQVMsRUFBRTtBQUhFLENBQWY7O0FBTU8sSUFBTUMsaUJBQWlCLEdBQUcsU0FBcEJBLGlCQUFvQixP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