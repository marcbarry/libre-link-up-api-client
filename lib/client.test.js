"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _client = require("./client");

(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var username, password, version, libreClient, data;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = 'USERNAME';
          password = 'PASSWORD';
          version = '4.9.0';
          libreClient = (0, _client.LibreLinkUpClient)({
            username: username,
            password: password,
            version: version,
            connectionIdentifier: 'IDENTIFIER'
          });
          _context.next = 6;
          return libreClient.read();

        case 6:
          data = _context.sent;
          console.log(data);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ1c2VybmFtZSIsInBhc3N3b3JkIiwidmVyc2lvbiIsImxpYnJlQ2xpZW50IiwiTGlicmVMaW5rVXBDbGllbnQiLCJjb25uZWN0aW9uSWRlbnRpZmllciIsInJlYWQiLCJkYXRhIiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQudGVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMaWJyZUxpbmtVcENsaWVudCB9IGZyb20gJy4vY2xpZW50JztcblxuKGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgdXNlcm5hbWUgPSAnVVNFUk5BTUUnO1xuICBjb25zdCBwYXNzd29yZCA9ICdQQVNTV09SRCc7XG4gIGNvbnN0IHZlcnNpb24gPSAnNC45LjAnO1xuICBjb25zdCBsaWJyZUNsaWVudCA9IExpYnJlTGlua1VwQ2xpZW50KHtcbiAgICB1c2VybmFtZSxcbiAgICBwYXNzd29yZCxcbiAgICB2ZXJzaW9uLFxuICAgIGNvbm5lY3Rpb25JZGVudGlmaWVyOiAnSURFTlRJRklFUicsXG4gIH0pO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBsaWJyZUNsaWVudC5yZWFkKCk7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xufSkoKTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFFQSw4RUFBQztFQUFBO0VBQUE7SUFBQTtNQUFBO1FBQUE7VUFDT0EsUUFEUCxHQUNrQixVQURsQjtVQUVPQyxRQUZQLEdBRWtCLFVBRmxCO1VBR09DLE9BSFAsR0FHaUIsT0FIakI7VUFJT0MsV0FKUCxHQUlxQixJQUFBQyx5QkFBQSxFQUFrQjtZQUNwQ0osUUFBUSxFQUFSQSxRQURvQztZQUVwQ0MsUUFBUSxFQUFSQSxRQUZvQztZQUdwQ0MsT0FBTyxFQUFQQSxPQUhvQztZQUlwQ0csb0JBQW9CLEVBQUU7VUFKYyxDQUFsQixDQUpyQjtVQUFBO1VBQUEsT0FXb0JGLFdBQVcsQ0FBQ0csSUFBWixFQVhwQjs7UUFBQTtVQVdPQyxJQVhQO1VBWUNDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRixJQUFaOztRQVpEO1FBQUE7VUFBQTtNQUFBO0lBQUE7RUFBQTtBQUFBLENBQUQifQ==