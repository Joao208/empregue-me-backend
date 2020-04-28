module.exports = function parseStringAsArray(arr = []) {
    return arr.length ? arr.split(',').map(e => e.trim()) : null;
  }
  