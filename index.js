var myArgs = process.argv.slice(2);
console.log(romanToInt(myArgs[0]));
function romanToInt(s) {
    var romanMap = new Map([
        ['I', 1,],
        ['V', 5,],
        ['X', 10,],
        ['L', 50,],
        ['C', 100,],
        ['D', 500,],
        ['M', 1000,],
    ]);
    var total = 0;
    var prevNum = null;
    var toAdd = null;
    for (var i = 0; i < s.length; i++) {
        var value = romanMap.get(s[i]);
        if (value != null) {
            if (prevNum != null && prevNum < value) {
                total -= prevNum * 2;
            }
            total += value;
            prevNum = value;
        }
    }
    return total;
}
;
