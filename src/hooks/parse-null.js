
function isObject(val) {
  return val.constructor === Object;
}

function isArray(val) {
  return Array.isArray(val);
}

function parseValue(val) {
  if (typeof val == 'undefined' || val == '') {
    return undefined;
  } else if (isArray(val)) {
    return parseArray(val);
  } else if (isObject(val)) {
    return parseObject(val);
  } else if (typeof val === 'string' && val.toUpperCase() === 'NULL') {
    return null;
  } else {
    return val;
  }
}

function parseObject(obj) {
  var result = {};
  var key, val;
  for (key in obj) {
    val = parseValue(obj[key]);
    if (val !== undefined) result[key] = val;
  }
  return result;
}

function parseArray(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = parseValue(arr[i]);
  }
  return result;
}

module.exports = {

  parseNull: () => {

    return async context => {
      context.params.query = parseObject(context.params.query);
      return context;
    };

  }

};