Array.prototype.forEach2 = function (callback, thisArg) {
  const length = this.length;
  console.log(this);
  for (let i = 0; i < length; i++) {
    callback.call(thisArg, this[i], i, this);
  }
};

const arr = [1, 2, 3];
const arr2 = [4, 5, 6];
arr.forEach2(function (item, index) {
  console.log(this);
}, arr2);
