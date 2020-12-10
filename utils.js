module.exports = {
    arrayFix: function(array) {
        const newArray = []
        let id = 0
        for(let it of array) {
            if (it != "") {
                newArray[id] = it
                id++
            }
        }


        return newArray
    }
}