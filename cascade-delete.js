'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = function debug() {};

var idName = function idName(m) {
  return m.definition.idName() || 'id';
};
var getIdValue = function getIdValue(m, data) {
  return data && data[idName(m)];
};

var cascadeDeletes = function cascadeDeletes(modelId, Model, options) {
  return _promise2.default.all(options.relations.map(function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(relationData) {
      var relation, relationForeignKey, relationDeepDelete, relationModel, relationKey, where, instancesToDelete;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
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
                _context.next = 6;
                break;
              }

              throw new Error('Please, set relation name! loopback-cascade-mixin');

            case 6:

              debug('Relation ' + relation + ' model ' + Model.definition.name);

              if (Model.relations[relation]) {
                _context.next = 10;
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
                _context.next = 15;
                break;
              }

              throw new Error('Bad relation key name! \n      ' + Model.definition.name + ' - ' + relationModel.definition.name + ' \n      loopback cascade-delete-mixin');

            case 15:
              where = {};

              where[relationKey] = modelId;

              if (!(relationDeepDelete || options.deepDelete)) {
                _context.next = 25;
                break;
              }

              _context.next = 20;
              return new _promise2.default(function (resolve) {
                relationModel.find({ where: where }, function (err, instancesToDelete) {
                  resolve(instancesToDelete);
                });
              });

            case 20:
              instancesToDelete = _context.sent;
              _context.next = 23;
              return _promise2.default.all(instancesToDelete.map(function (item) {
                return new _promise2.default(function (resolve, reject) {
                  item.destroy(resolve);
                });
              }));

            case 23:
              _context.next = 27;
              break;

            case 25:
              _context.next = 27;
              return new _promise2.default(function (resolve, reject) {
                relationModel.destroyAll(where, resolve);
              });

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }()));
};

module.exports = function (Model, options) {
  Model.observe('after save', function (ctx, next) {
    if (!ctx || !ctx.data || !ctx.data.deletedAt || !ctx.where || !ctx.where.and) {
      return next();
    }

    var name = idName(Model);
    var hasInstanceId = ctx.instance && ctx.instance[name];
    var where = ctx.where.and[0];
    var hasWhereId = where && where[name];
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
  Model.observe('after delete', function (ctx) {
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

    var modelInstanceId = getIdValue(Model, ctx.instance || ctx.where);

    return cascadeDeletes(modelInstanceId, Model, options).then(function () {
      debug('Cascade delete has successfully finished');
      return true;
    }).catch(function (err) {
      debug('Error with cascading deletes', err);
      return _promise2.default.reject(err);
    });
  });
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhc2NhZGUtZGVsZXRlLmpzIl0sIm5hbWVzIjpbImRlYnVnIiwiaWROYW1lIiwibSIsImRlZmluaXRpb24iLCJnZXRJZFZhbHVlIiwiZGF0YSIsImNhc2NhZGVEZWxldGVzIiwibW9kZWxJZCIsIk1vZGVsIiwib3B0aW9ucyIsImFsbCIsInJlbGF0aW9ucyIsIm1hcCIsInJlbGF0aW9uRGF0YSIsInJlbGF0aW9uIiwicmVsYXRpb25Gb3JlaWduS2V5IiwicmVsYXRpb25EZWVwRGVsZXRlIiwiT2JqZWN0IiwibmFtZSIsImZvcmVpZ25LZXkiLCJkZWVwRGVsZXRlIiwiRXJyb3IiLCJyZWxhdGlvbk1vZGVsIiwibW9kZWxUbyIsInJlbGF0aW9uS2V5Iiwia2V5VG8iLCJtb2RlbFRocm91Z2giLCJwcm9wZXJ0aWVzIiwid2hlcmUiLCJyZXNvbHZlIiwiZmluZCIsImVyciIsImluc3RhbmNlc1RvRGVsZXRlIiwicmVqZWN0IiwiaXRlbSIsImRlc3Ryb3kiLCJkZXN0cm95QWxsIiwibW9kdWxlIiwiZXhwb3J0cyIsIm9ic2VydmUiLCJjdHgiLCJuZXh0IiwiZGVsZXRlZEF0IiwiYW5kIiwiaGFzSW5zdGFuY2VJZCIsImluc3RhbmNlIiwiaGFzV2hlcmVJZCIsImhhc01peGluT3B0aW9uIiwiQXJyYXkiLCJpc0FycmF5IiwibW9kZWxJbnN0YW5jZUlkIiwidGhlbiIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsUUFBUSxTQUFSQSxLQUFRLEdBQU0sQ0FBRSxDQUF0Qjs7QUFFQSxJQUFNQyxTQUFTLFNBQVRBLE1BQVM7QUFBQSxTQUFLQyxFQUFFQyxVQUFGLENBQWFGLE1BQWIsTUFBeUIsSUFBOUI7QUFBQSxDQUFmO0FBQ0EsSUFBTUcsYUFBYSxTQUFiQSxVQUFhLENBQUNGLENBQUQsRUFBSUcsSUFBSjtBQUFBLFNBQWFBLFFBQVFBLEtBQUtKLE9BQU9DLENBQVAsQ0FBTCxDQUFyQjtBQUFBLENBQW5COztBQUVBLElBQU1J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QUFFRCxRQUFNcUIsa0JBQWtCOUMsV0FBV0ksS0FBWCxFQUFrQmdDLElBQUlLLFFBQUosSUFBZ0JMLElBQUlaLEtBQXRDLENBQXhCOztBQUVBLFdBQU90QixlQUFlNEMsZUFBZixFQUFnQzFDLEtBQWhDLEVBQXVDQyxPQUF2QyxFQUNKMEMsSUFESSxDQUNDLFlBQU07QUFDVm5ELFlBQU0sMENBQU47QUFDQSxhQUFPLElBQVA7QUFDRCxLQUpJLEVBS0pvRCxLQUxJLENBS0UsVUFBQ3JCLEdBQUQsRUFBUztBQUNkL0IsWUFBTSw4QkFBTixFQUFzQytCLEdBQXRDO0FBQ0EsYUFBTyxrQkFBUUUsTUFBUixDQUFlRixHQUFmLENBQVA7QUFDRCxLQVJJLENBQVA7QUFTRCxHQTNCRDtBQTRCRCxDQW5FRCIsImZpbGUiOiJjYXNjYWRlLWRlbGV0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlYnVnID0gKCkgPT4ge307XG5cbmNvbnN0IGlkTmFtZSA9IG0gPT4gbS5kZWZpbml0aW9uLmlkTmFtZSgpIHx8ICdpZCc7XG5jb25zdCBnZXRJZFZhbHVlID0gKG0sIGRhdGEpID0+IGRhdGEgJiYgZGF0YVtpZE5hbWUobSldO1xuXG5jb25zdCBjYXNjYWRlRGVsZXRlcyA9IChtb2RlbElkLCBNb2RlbCwgb3B0aW9ucykgPT5cbiAgUHJvbWlzZS5hbGwob3B0aW9ucy5yZWxhdGlvbnMubWFwKGFzeW5jIChyZWxhdGlvbkRhdGEpID0+IHtcbiAgICBsZXQgcmVsYXRpb247XG4gICAgbGV0IHJlbGF0aW9uRm9yZWlnbktleTtcbiAgICBsZXQgcmVsYXRpb25EZWVwRGVsZXRlO1xuXG4gICAgaWYgKHJlbGF0aW9uRGF0YSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgcmVsYXRpb24gPSByZWxhdGlvbkRhdGEubmFtZTtcbiAgICAgIHJlbGF0aW9uRm9yZWlnbktleSA9IHJlbGF0aW9uRGF0YS5mb3JlaWduS2V5O1xuICAgICAgcmVsYXRpb25EZWVwRGVsZXRlID0gcmVsYXRpb25EYXRhLmRlZXBEZWxldGU7XG4gICAgfSBlbHNlIHJlbGF0aW9uID0gcmVsYXRpb25EYXRhO1xuXG4gICAgaWYgKCFyZWxhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UsIHNldCByZWxhdGlvbiBuYW1lISBsb29wYmFjay1jYXNjYWRlLW1peGluJyk7XG4gICAgfVxuXG4gICAgZGVidWcoYFJlbGF0aW9uICR7cmVsYXRpb259IG1vZGVsICR7TW9kZWwuZGVmaW5pdGlvbi5uYW1lfWApO1xuXG4gICAgaWYgKCFNb2RlbC5yZWxhdGlvbnNbcmVsYXRpb25dKSB7XG4gICAgICBkZWJ1ZyhgUmVsYXRpb24gJHtyZWxhdGlvbn0gbm90IGZvdW5kIGZvciBtb2RlbCAke01vZGVsLmRlZmluaXRpb24ubmFtZX1gKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVsYXRpb24gJHtyZWxhdGlvbn0gbm90IGZvdW5kIGZvciBtb2RlbCAke01vZGVsLmRlZmluaXRpb24ubmFtZX1gKTtcbiAgICB9XG5cblxuICAgIGxldCByZWxhdGlvbk1vZGVsID0gTW9kZWwucmVsYXRpb25zW3JlbGF0aW9uXS5tb2RlbFRvO1xuICAgIGNvbnN0IHJlbGF0aW9uS2V5ID0gcmVsYXRpb25Gb3JlaWduS2V5IHx8IE1vZGVsLnJlbGF0aW9uc1tyZWxhdGlvbl0ua2V5VG87XG5cbiAgICBpZiAoTW9kZWwucmVsYXRpb25zW3JlbGF0aW9uXS5tb2RlbFRocm91Z2gpIHtcbiAgICAgIHJlbGF0aW9uTW9kZWwgPSBNb2RlbC5yZWxhdGlvbnNbcmVsYXRpb25dLm1vZGVsVGhyb3VnaDtcbiAgICB9XG5cbiAgICBpZiAoIXJlbGF0aW9uTW9kZWwuZGVmaW5pdGlvbi5wcm9wZXJ0aWVzW3JlbGF0aW9uS2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBCYWQgcmVsYXRpb24ga2V5IG5hbWUhIFxuICAgICAgJHtNb2RlbC5kZWZpbml0aW9uLm5hbWV9IC0gJHtyZWxhdGlvbk1vZGVsLmRlZmluaXRpb24ubmFtZX0gXG4gICAgICBsb29wYmFjayBjYXNjYWRlLWRlbGV0ZS1taXhpbmApO1xuICAgIH1cblxuICAgIGNvbnN0IHdoZXJlID0ge307XG4gICAgd2hlcmVbcmVsYXRpb25LZXldID0gbW9kZWxJZDtcbiAgICBpZiAocmVsYXRpb25EZWVwRGVsZXRlIHx8IG9wdGlvbnMuZGVlcERlbGV0ZSkge1xuICAgICAgY29uc3QgaW5zdGFuY2VzVG9EZWxldGUgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZWxhdGlvbk1vZGVsLmZpbmQoeyB3aGVyZSB9LCAoZXJyLCBpbnN0YW5jZXNUb0RlbGV0ZSkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoaW5zdGFuY2VzVG9EZWxldGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBhd2FpdCBQcm9taXNlLmFsbChpbnN0YW5jZXNUb0RlbGV0ZS5tYXAoaXRlbSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGl0ZW0uZGVzdHJveShyZXNvbHZlKTtcbiAgICAgIH0pKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgcmVsYXRpb25Nb2RlbC5kZXN0cm95QWxsKHdoZXJlLCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChNb2RlbCwgb3B0aW9ucykgPT4ge1xuICBNb2RlbC5vYnNlcnZlKCdhZnRlciBzYXZlJywgKGN0eCwgbmV4dCkgPT4ge1xuICAgIGlmICghY3R4IHx8ICFjdHguZGF0YSB8fCAhY3R4LmRhdGEuZGVsZXRlZEF0IHx8ICFjdHgud2hlcmUgfHwgIWN0eC53aGVyZS5hbmQpIHtcbiAgICAgIHJldHVybiBuZXh0KCk7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZSA9IGlkTmFtZShNb2RlbCk7XG4gICAgY29uc3QgaGFzSW5zdGFuY2VJZCA9IGN0eC5pbnN0YW5jZSAmJiBjdHguaW5zdGFuY2VbbmFtZV07XG4gICAgY29uc3Qgd2hlcmUgPSBjdHgud2hlcmUuYW5kWzBdO1xuICAgIGNvbnN0IGhhc1doZXJlSWQgPSB3aGVyZSAmJiB3aGVyZVtuYW1lXTtcbiAgICBjb25zdCBoYXNNaXhpbk9wdGlvbiA9IG9wdGlvbnMgJiYgQXJyYXkuaXNBcnJheShvcHRpb25zLnJlbGF0aW9ucyk7XG5cbiAgICBpZiAoIShoYXNXaGVyZUlkIHx8IGhhc0luc3RhbmNlSWQpKSB7XG4gICAgICBkZWJ1ZygnU2tpcHBpbmcgZGVsZXRlIGZvciAnLCBNb2RlbC5kZWZpbml0aW9uLm5hbWUpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmICghaGFzTWl4aW5PcHRpb24pIHtcbiAgICAgIGRlYnVnKCdTa2lwcGluZyBkZWxldGUgZm9yJywgTW9kZWwuZGVmaW5pdGlvbi5uYW1lLCAnUGxlYXNlIGFkZCBtaXhpbiBvcHRpb25zJyk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbW9kZWxJbnN0YW5jZUlkID0gZ2V0SWRWYWx1ZShNb2RlbCwgY3R4Lmluc3RhbmNlIHx8IGN0eC53aGVyZS5hbmRbMF0pO1xuXG4gICAgaWYgKCFtb2RlbEluc3RhbmNlSWQpIHtcbiAgICAgIGRlYnVnKCdTa2lwcGluZyBkZWxldGUgZm9yJywgTW9kZWwuZGVmaW5pdGlvbi5uYW1lLCAnR2V0IGlkIGVycm9yLicpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBjYXNjYWRlRGVsZXRlcyhtb2RlbEluc3RhbmNlSWQsIE1vZGVsLCBvcHRpb25zKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBkZWJ1ZygnQ2FzY2FkZSBkZWxldGUgaGFzIHN1Y2Nlc3NmdWxseSBmaW5pc2hlZCcpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBkZWJ1ZygnRXJyb3Igd2l0aCBjYXNjYWRpbmcgZGVsZXRlcycsIGVycik7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgfSk7XG4gIH0pO1xuICBNb2RlbC5vYnNlcnZlKCdhZnRlciBkZWxldGUnLCAoY3R4KSA9PiB7XG4gICAgY29uc3QgbmFtZSA9IGlkTmFtZShNb2RlbCk7XG4gICAgY29uc3QgaGFzSW5zdGFuY2VJZCA9IGN0eC5pbnN0YW5jZSAmJiBjdHguaW5zdGFuY2VbbmFtZV07XG4gICAgY29uc3QgaGFzV2hlcmVJZCA9IGN0eC53aGVyZSAmJiBjdHgud2hlcmVbbmFtZV07XG4gICAgY29uc3QgaGFzTWl4aW5PcHRpb24gPSBvcHRpb25zICYmIEFycmF5LmlzQXJyYXkob3B0aW9ucy5yZWxhdGlvbnMpO1xuXG4gICAgaWYgKCEoaGFzV2hlcmVJZCB8fCBoYXNJbnN0YW5jZUlkKSkge1xuICAgICAgZGVidWcoJ1NraXBwaW5nIGRlbGV0ZSBmb3IgJywgTW9kZWwuZGVmaW5pdGlvbi5uYW1lKTtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoIWhhc01peGluT3B0aW9uKSB7XG4gICAgICBkZWJ1ZygnU2tpcHBpbmcgZGVsZXRlIGZvcicsIE1vZGVsLmRlZmluaXRpb24ubmFtZSwgJ1BsZWFzZSBhZGQgbWl4aW4gb3B0aW9ucycpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGVsSW5zdGFuY2VJZCA9IGdldElkVmFsdWUoTW9kZWwsIGN0eC5pbnN0YW5jZSB8fCBjdHgud2hlcmUpO1xuXG4gICAgcmV0dXJuIGNhc2NhZGVEZWxldGVzKG1vZGVsSW5zdGFuY2VJZCwgTW9kZWwsIG9wdGlvbnMpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGRlYnVnKCdDYXNjYWRlIGRlbGV0ZSBoYXMgc3VjY2Vzc2Z1bGx5IGZpbmlzaGVkJyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGRlYnVnKCdFcnJvciB3aXRoIGNhc2NhZGluZyBkZWxldGVzJywgZXJyKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgfSk7XG59O1xuIl19
