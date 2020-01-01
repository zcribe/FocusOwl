export function objArrToArr(objArr) {
    // Helper method for converting array of objects to a simple array
    let outArr = [];
    for (let i = 0; i < objArr.length; i++) {
        outArr.push(objArr[i]["workMinutes"])
    }
    return outArr
}