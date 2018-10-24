'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _debug2 = require('./debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)();

var idName = function idName(m) {
  return m.definition.idName() || 'id';
};
var getIdValue = function getIdValue(m, data) {
  return data && data[idName(m)];
};

var cascadeDeletes = function cascadeDeletes(modelId, Model, options) {
  return _promise2.default.all(options.relations.map(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(relationData) {
      var relation, relationForeignKey, relationDeepDelete, relationModel, relationKey, where, instancesToDelete;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              relation = void 0;
              relationForeignKey = void 0;
              relationDeepDelete = void 0;


              if (relationData instanceof Object) {
                relation = relationData.name;
                relationForeignKey = relationData.foreignKey;
                relationDeepDelete = relationData.deepDelete;
              } else relation = relationData;

              if (relation) {
                _context2.next = 6;
                break;
              }

              throw new Error('Please, set relation name! loopback-cascade-mixin');

            case 6:

              debug('Relation ' + relation + ' model ' + Model.definition.name);

              if (Model.relations[relation]) {
                _context2.next = 10;
                break;
              }

              debug('Relation ' + relation + ' not found for model ' + Model.definition.name);
              throw new Error('Relation ' + relation + ' not found for model ' + Model.definition.name);

            case 10:
              relationModel = Model.relations[relation].modelTo;
              relationKey = relationForeignKey || Model.relations[relation].keyTo;


              if (Model.relations[relation].modelThrough) {
                relationModel = Model.relations[relation].modelThrough;
              }

              if (relationModel.definition.properties[relationKey]) {
                _context2.next = 15;
                break;
              }

              throw new Error('Bad relation key name! \n      ' + Model.definition.name + ' - ' + relationModel.definition.name + ' \n      loopback cascade-delete-mixin');

            case 15:
              where = {};

              where[relationKey] = modelId;

              if (!(relationDeepDelete || relationDeepDelete && options.deepDelete)) {
                _context2.next = 24;
                break;
              }

              _context2.next = 20;
              return relationModel.find({ where: where });

            case 20:
              instancesToDelete = _context2.sent;


              instancesToDelete.forEach(function () {
                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(instance) {
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return instance.destroy();

                        case 2:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
              _context2.next = 26;
              break;

            case 24:
              _context2.next = 26;
              return relationModel.destroyAll(where);

            case 26:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()));
};

exports.default = function (Model, options) {
  Model.observe('after save', function (ctx, next) {
    if (!ctx || !ctx.data || !ctx.data.deletedAt || !ctx.where || !ctx.where.and) {
      return next();
    }

    var name = idName(Model);
    var hasInstanceId = ctx.instance && ctx.instance[name];
    var hasWhereId = ctx.where && ctx.where[name];
    var hasMixinOption = options && Array.isArray(options.relations);

    if (!(hasWhereId || hasInstanceId)) {
      debug('Skipping delete for ', Model.definition.name);
      return _promise2.default.resolve();
    }

    if (!hasMixinOption) {
      debug('Skipping delete for', Model.definition.name, 'Please add mixin options');
      return _promise2.default.resolve();
    }

    var modelInstanceId = getIdValue(Model, ctx.instance || ctx.where.and[0]);

    if (!modelInstanceId) {
      debug('Skipping delete for', Model.definition.name, 'Get id error.');
      return _promise2.default.resolve();
    }

    return cascadeDeletes(modelInstanceId, Model, options).then(function () {
      debug('Cascade delete has successfully finished');
      return true;
    }).catch(function (err) {
      debug('Error with cascading deletes', err);
      return _promise2.default.reject(err);
    });
  });
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2NhZGUtZGVsZXRlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiaWROYW1lIiwibSIsImRlZmluaXRpb24iLCJnZXRJZFZhbHVlIiwiZGF0YSIsImNhc2NhZGVEZWxldGVzIiwibW9kZWxJZCIsIk1vZGVsIiwib3B0aW9ucyIsImFsbCIsInJlbGF0aW9ucyIsIm1hcCIsInJlbGF0aW9uRGF0YSIsInJlbGF0aW9uIiwicmVsYXRpb25Gb3JlaWduS2V5IiwicmVsYXRpb25EZWVwRGVsZXRlIiwiT2JqZWN0IiwibmFtZSIsImZvcmVpZ25LZXkiLCJkZWVwRGVsZXRlIiwiRXJyb3IiLCJyZWxhdGlvbk1vZGVsIiwibW9kZWxUbyIsInJlbGF0aW9uS2V5Iiwia2V5VG8iLCJtb2RlbFRocm91Z2giLCJwcm9wZXJ0aWVzIiwid2hlcmUiLCJmaW5kIiwiaW5zdGFuY2VzVG9EZWxldGUiLCJmb3JFYWNoIiwiaW5zdGFuY2UiLCJkZXN0cm95IiwiZGVzdHJveUFsbCIsIm9ic2VydmUiLCJjdHgiLCJuZXh0IiwiZGVsZXRlZEF0IiwiYW5kIiwiaGFzSW5zdGFuY2VJZCIsImhhc1doZXJlSWQiLCJoYXNNaXhpbk9wdGlvbiIsIkFycmF5IiwiaXNBcnJheSIsInJlc29sdmUiLCJtb2RlbEluc3RhbmNlSWQiLCJ0aGVuIiwiY2F0Y2giLCJlcnIiLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxRQUFRLHNCQUFkOztBQUVBLElBQU1DLFNBQVMsU0FBVEEsTUFBUztBQUFBLFNBQUtDLEVBQUVDLFVBQUYsQ0FBYUYsTUFBYixNQUF5QixJQUE5QjtBQUFBLENBQWY7QUFDQSxJQUFNRyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0YsQ0FBRCxFQUFJRyxJQUFKO0FBQUEsU0FBYUEsUUFBUUEsS0FBS0osT0FBT0MsQ0FBUCxDQUFMLENBQXJCO0FBQUEsQ0FBbkI7O0FBRUEsSUFBTUksaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBaUJDLE9BQWpCO0FBQUEsU0FDckIsa0JBQVFDLEdBQVIsQ0FBWUQsUUFBUUUsU0FBUixDQUFrQkMsR0FBbEI7QUFBQSx3RkFBc0Isa0JBQU9DLFlBQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQzVCQyxzQkFENEI7QUFFNUJDLGdDQUY0QjtBQUc1QkMsZ0NBSDRCOzs7QUFLaEMsa0JBQUlILHdCQUF3QkksTUFBNUIsRUFBb0M7QUFDbENILDJCQUFXRCxhQUFhSyxJQUF4QjtBQUNBSCxxQ0FBcUJGLGFBQWFNLFVBQWxDO0FBQ0FILHFDQUFxQkgsYUFBYU8sVUFBbEM7QUFDRCxlQUpELE1BSU9OLFdBQVdELFlBQVg7O0FBVHlCLGtCQVczQkMsUUFYMkI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0JBWXhCLElBQUlPLEtBQUosQ0FBVSxtREFBVixDQVp3Qjs7QUFBQTs7QUFlaENyQixrQ0FBa0JjLFFBQWxCLGVBQW9DTixNQUFNTCxVQUFOLENBQWlCZSxJQUFyRDs7QUFmZ0Msa0JBaUIzQlYsTUFBTUcsU0FBTixDQUFnQkcsUUFBaEIsQ0FqQjJCO0FBQUE7QUFBQTtBQUFBOztBQWtCOUJkLGtDQUFrQmMsUUFBbEIsNkJBQWtETixNQUFNTCxVQUFOLENBQWlCZSxJQUFuRTtBQWxCOEIsb0JBbUJ4QixJQUFJRyxLQUFKLGVBQXNCUCxRQUF0Qiw2QkFBc0ROLE1BQU1MLFVBQU4sQ0FBaUJlLElBQXZFLENBbkJ3Qjs7QUFBQTtBQXVCNUJJLDJCQXZCNEIsR0F1QlpkLE1BQU1HLFNBQU4sQ0FBZ0JHLFFBQWhCLEVBQTBCUyxPQXZCZDtBQXdCMUJDLHlCQXhCMEIsR0F3QlpULHNCQUFzQlAsTUFBTUcsU0FBTixDQUFnQkcsUUFBaEIsRUFBMEJXLEtBeEJwQzs7O0FBMEJoQyxrQkFBSWpCLE1BQU1HLFNBQU4sQ0FBZ0JHLFFBQWhCLEVBQTBCWSxZQUE5QixFQUE0QztBQUMxQ0osZ0NBQWdCZCxNQUFNRyxTQUFOLENBQWdCRyxRQUFoQixFQUEwQlksWUFBMUM7QUFDRDs7QUE1QitCLGtCQThCM0JKLGNBQWNuQixVQUFkLENBQXlCd0IsVUFBekIsQ0FBb0NILFdBQXBDLENBOUIyQjtBQUFBO0FBQUE7QUFBQTs7QUFBQSxvQkErQnhCLElBQUlILEtBQUoscUNBQ0piLE1BQU1MLFVBQU4sQ0FBaUJlLElBRGIsV0FDdUJJLGNBQWNuQixVQUFkLENBQXlCZSxJQURoRCw0Q0EvQndCOztBQUFBO0FBcUMxQlUsbUJBckMwQixHQXFDbEIsRUFyQ2tCOztBQXNDaENBLG9CQUFNSixXQUFOLElBQXFCakIsT0FBckI7O0FBdENnQyxvQkF3QzVCUyxzQkFBdUJBLHNCQUFzQlAsUUFBUVcsVUF4Q3pCO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEscUJBeUNFRSxjQUFjTyxJQUFkLENBQW1CLEVBQUVELFlBQUYsRUFBbkIsQ0F6Q0Y7O0FBQUE7QUF5Q3hCRSwrQkF6Q3dCOzs7QUEyQzlCQSxnQ0FBa0JDLE9BQWxCO0FBQUEscUdBQTBCLGlCQUFPQyxRQUFQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlDQUNsQkEsU0FBU0MsT0FBVCxFQURrQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBMUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEzQzhCO0FBQUE7O0FBQUE7QUFBQTtBQUFBLHFCQStDeEJYLGNBQWNZLFVBQWQsQ0FBeUJOLEtBQXpCLENBL0N3Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUF0Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUFaLENBRHFCO0FBQUEsQ0FBdkI7O2tCQW9EZSxVQUFDcEIsS0FBRCxFQUFRQyxPQUFSLEVBQW9CO0FBQ2pDRCxRQUFNMkIsT0FBTixDQUFjLFlBQWQsRUFBNEIsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDekMsUUFBSSxDQUFDRCxHQUFELElBQVEsQ0FBQ0EsSUFBSS9CLElBQWIsSUFBcUIsQ0FBQytCLElBQUkvQixJQUFKLENBQVNpQyxTQUEvQixJQUE0QyxDQUFDRixJQUFJUixLQUFqRCxJQUEwRCxDQUFDUSxJQUFJUixLQUFKLENBQVVXLEdBQXpFLEVBQThFO0FBQzVFLGFBQU9GLE1BQVA7QUFDRDs7QUFFRCxRQUFNbkIsT0FBT2pCLE9BQU9PLEtBQVAsQ0FBYjtBQUNBLFFBQU1nQyxnQkFBZ0JKLElBQUlKLFFBQUosSUFBZ0JJLElBQUlKLFFBQUosQ0FBYWQsSUFBYixDQUF0QztBQUNBLFFBQU11QixhQUFhTCxJQUFJUixLQUFKLElBQWFRLElBQUlSLEtBQUosQ0FBVVYsSUFBVixDQUFoQztBQUNBLFFBQU13QixpQkFBaUJqQyxXQUFXa0MsTUFBTUMsT0FBTixDQUFjbkMsUUFBUUUsU0FBdEIsQ0FBbEM7O0FBRUEsUUFBSSxFQUFFOEIsY0FBY0QsYUFBaEIsQ0FBSixFQUFvQztBQUNsQ3hDLFlBQU0sc0JBQU4sRUFBOEJRLE1BQU1MLFVBQU4sQ0FBaUJlLElBQS9DO0FBQ0EsYUFBTyxrQkFBUTJCLE9BQVIsRUFBUDtBQUNEOztBQUVELFFBQUksQ0FBQ0gsY0FBTCxFQUFxQjtBQUNuQjFDLFlBQU0scUJBQU4sRUFBNkJRLE1BQU1MLFVBQU4sQ0FBaUJlLElBQTlDLEVBQW9ELDBCQUFwRDtBQUNBLGFBQU8sa0JBQVEyQixPQUFSLEVBQVA7QUFDRDs7QUFFRCxRQUFNQyxrQkFBa0IxQyxXQUFXSSxLQUFYLEVBQWtCNEIsSUFBSUosUUFBSixJQUFnQkksSUFBSVIsS0FBSixDQUFVVyxHQUFWLENBQWMsQ0FBZCxDQUFsQyxDQUF4Qjs7QUFFQSxRQUFJLENBQUNPLGVBQUwsRUFBc0I7QUFDcEI5QyxZQUFNLHFCQUFOLEVBQTZCUSxNQUFNTCxVQUFOLENBQWlCZSxJQUE5QyxFQUFvRCxlQUFwRDtBQUNBLGFBQU8sa0JBQVEyQixPQUFSLEVBQVA7QUFDRDs7QUFFRCxXQUFPdkMsZUFBZXdDLGVBQWYsRUFBZ0N0QyxLQUFoQyxFQUF1Q0MsT0FBdkMsRUFDSnNDLElBREksQ0FDQyxZQUFNO0FBQ1YvQyxZQUFNLDBDQUFOO0FBQ0EsYUFBTyxJQUFQO0FBQ0QsS0FKSSxFQUtKZ0QsS0FMSSxDQUtFLFVBQUNDLEdBQUQsRUFBUztBQUNkakQsWUFBTSw4QkFBTixFQUFzQ2lELEdBQXRDO0FBQ0EsYUFBTyxrQkFBUUMsTUFBUixDQUFlRCxHQUFmLENBQVA7QUFDRCxLQVJJLENBQVA7QUFTRCxHQXBDRDtBQXFDRCxDIiwiZmlsZSI6ImNhc2NhZGUtZGVsZXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICcuL2RlYnVnJztcblxuY29uc3QgZGVidWcgPSBfZGVidWcoKTtcblxuY29uc3QgaWROYW1lID0gbSA9PiBtLmRlZmluaXRpb24uaWROYW1lKCkgfHwgJ2lkJztcbmNvbnN0IGdldElkVmFsdWUgPSAobSwgZGF0YSkgPT4gZGF0YSAmJiBkYXRhW2lkTmFtZShtKV07XG5cbmNvbnN0IGNhc2NhZGVEZWxldGVzID0gKG1vZGVsSWQsIE1vZGVsLCBvcHRpb25zKSA9PlxuICBQcm9taXNlLmFsbChvcHRpb25zLnJlbGF0aW9ucy5tYXAoYXN5bmMgKHJlbGF0aW9uRGF0YSkgPT4ge1xuICAgIGxldCByZWxhdGlvbjtcbiAgICBsZXQgcmVsYXRpb25Gb3JlaWduS2V5O1xuICAgIGxldCByZWxhdGlvbkRlZXBEZWxldGU7XG5cbiAgICBpZiAocmVsYXRpb25EYXRhIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICByZWxhdGlvbiA9IHJlbGF0aW9uRGF0YS5uYW1lO1xuICAgICAgcmVsYXRpb25Gb3JlaWduS2V5ID0gcmVsYXRpb25EYXRhLmZvcmVpZ25LZXk7XG4gICAgICByZWxhdGlvbkRlZXBEZWxldGUgPSByZWxhdGlvbkRhdGEuZGVlcERlbGV0ZTtcbiAgICB9IGVsc2UgcmVsYXRpb24gPSByZWxhdGlvbkRhdGE7XG5cbiAgICBpZiAoIXJlbGF0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSwgc2V0IHJlbGF0aW9uIG5hbWUhIGxvb3BiYWNrLWNhc2NhZGUtbWl4aW4nKTtcbiAgICB9XG5cbiAgICBkZWJ1ZyhgUmVsYXRpb24gJHtyZWxhdGlvbn0gbW9kZWwgJHtNb2RlbC5kZWZpbml0aW9uLm5hbWV9YCk7XG5cbiAgICBpZiAoIU1vZGVsLnJlbGF0aW9uc1tyZWxhdGlvbl0pIHtcbiAgICAgIGRlYnVnKGBSZWxhdGlvbiAke3JlbGF0aW9ufSBub3QgZm91bmQgZm9yIG1vZGVsICR7TW9kZWwuZGVmaW5pdGlvbi5uYW1lfWApO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZWxhdGlvbiAke3JlbGF0aW9ufSBub3QgZm91bmQgZm9yIG1vZGVsICR7TW9kZWwuZGVmaW5pdGlvbi5uYW1lfWApO1xuICAgIH1cblxuXG4gICAgbGV0IHJlbGF0aW9uTW9kZWwgPSBNb2RlbC5yZWxhdGlvbnNbcmVsYXRpb25dLm1vZGVsVG87XG4gICAgY29uc3QgcmVsYXRpb25LZXkgPSByZWxhdGlvbkZvcmVpZ25LZXkgfHwgTW9kZWwucmVsYXRpb25zW3JlbGF0aW9uXS5rZXlUbztcblxuICAgIGlmIChNb2RlbC5yZWxhdGlvbnNbcmVsYXRpb25dLm1vZGVsVGhyb3VnaCkge1xuICAgICAgcmVsYXRpb25Nb2RlbCA9IE1vZGVsLnJlbGF0aW9uc1tyZWxhdGlvbl0ubW9kZWxUaHJvdWdoO1xuICAgIH1cblxuICAgIGlmICghcmVsYXRpb25Nb2RlbC5kZWZpbml0aW9uLnByb3BlcnRpZXNbcmVsYXRpb25LZXldKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEJhZCByZWxhdGlvbiBrZXkgbmFtZSEgXG4gICAgICAke01vZGVsLmRlZmluaXRpb24ubmFtZX0gLSAke3JlbGF0aW9uTW9kZWwuZGVmaW5pdGlvbi5uYW1lfSBcbiAgICAgIGxvb3BiYWNrIGNhc2NhZGUtZGVsZXRlLW1peGluYCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuICAgIHdoZXJlW3JlbGF0aW9uS2V5XSA9IG1vZGVsSWQ7XG5cbiAgICBpZiAocmVsYXRpb25EZWVwRGVsZXRlIHx8IChyZWxhdGlvbkRlZXBEZWxldGUgJiYgb3B0aW9ucy5kZWVwRGVsZXRlKSkge1xuICAgICAgY29uc3QgaW5zdGFuY2VzVG9EZWxldGUgPSBhd2FpdCByZWxhdGlvbk1vZGVsLmZpbmQoeyB3aGVyZSB9KTtcblxuICAgICAgaW5zdGFuY2VzVG9EZWxldGUuZm9yRWFjaChhc3luYyAoaW5zdGFuY2UpID0+IHtcbiAgICAgICAgYXdhaXQgaW5zdGFuY2UuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHJlbGF0aW9uTW9kZWwuZGVzdHJveUFsbCh3aGVyZSk7XG4gICAgfVxuICB9KSk7XG5cbmV4cG9ydCBkZWZhdWx0IChNb2RlbCwgb3B0aW9ucykgPT4ge1xuICBNb2RlbC5vYnNlcnZlKCdhZnRlciBzYXZlJywgKGN0eCwgbmV4dCkgPT4ge1xuICAgIGlmICghY3R4IHx8ICFjdHguZGF0YSB8fCAhY3R4LmRhdGEuZGVsZXRlZEF0IHx8ICFjdHgud2hlcmUgfHwgIWN0eC53aGVyZS5hbmQpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IGlkTmFtZShNb2RlbCk7XG4gICAgY29uc3QgaGFzSW5zdGFuY2VJZCA9IGN0eC5pbnN0YW5jZSAmJiBjdHguaW5zdGFuY2VbbmFtZV07XG4gICAgY29uc3QgaGFzV2hlcmVJZCA9IGN0eC53aGVyZSAmJiBjdHgud2hlcmVbbmFtZV07XG4gICAgY29uc3QgaGFzTWl4aW5PcHRpb24gPSBvcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9ucy5yZWxhdGlvbnMpO1xuXG4gICAgaWYgKCEoaGFzV2hlcmVJZCB8fCBoYXNJbnN0YW5jZUlkKSkge1xuICAgICAgZGVidWcoJ1NraXBwaW5nIGRlbGV0ZSBmb3IgJywgTW9kZWwuZGVmaW5pdGlvbi5uYW1lKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc01peGluT3B0aW9uKSB7XG4gICAgICBkZWJ1ZygnU2tpcHBpbmcgZGVsZXRlIGZvcicsIE1vZGVsLmRlZmluaXRpb24ubmFtZSwgJ1BsZWFzZSBhZGQgbWl4aW4gb3B0aW9ucycpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsSW5zdGFuY2VJZCA9IGdldElkVmFsdWUoTW9kZWwsIGN0eC5pbnN0YW5jZSB8fCBjdHgud2hlcmUuYW5kWzBdKTtcblxuICAgIGlmICghbW9kZWxJbnN0YW5jZUlkKSB7XG4gICAgICBkZWJ1ZygnU2tpcHBpbmcgZGVsZXRlIGZvcicsIE1vZGVsLmRlZmluaXRpb24ubmFtZSwgJ0dldCBpZCBlcnJvci4nKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2FzY2FkZURlbGV0ZXMobW9kZWxJbnN0YW5jZUlkLCBNb2RlbCwgb3B0aW9ucylcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgZGVidWcoJ0Nhc2NhZGUgZGVsZXRlIGhhcyBzdWNjZXNzZnVsbHkgZmluaXNoZWQnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgZGVidWcoJ0Vycm9yIHdpdGggY2FzY2FkaW5nIGRlbGV0ZXMnLCBlcnIpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICB9KTtcbn07XG4iXX0=
