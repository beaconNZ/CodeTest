const myArgs = process.argv.slice(2);

console.log(romanToInt(myArgs[0]));

function romanToInt(s: string): number {
    const romanMap = new Map<String, number>([
        ['I' , 1,],
        ['V' , 5,],
        ['X' , 10,],
        ['L' , 50,],
        ['C' , 100,],
        ['D' , 500,],
        ['M' , 1000,],
    ]);
    
    let total : number = 0;
    let prevNum : number| null = null;
    let toAdd : number | null = null;

    
    for(let i= 0; i< s.length; i++) {
        let value = romanMap.get(s[i]);
        if(value != null) {
            if (prevNum != null && prevNum < value) {
                total -= prevNum *2;
            }
            total += value;
            prevNum = value;
        }


    }
    
    return total;
};
