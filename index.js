const calculator = document.getElementById("calculator");
const excel = document.getElementById("excel");
const table = document.getElementById("results");
const items = document.getElementById("headings");
const sel1 = document.getElementById("Name1");
const kInput = document.getElementById("KNN");
const compareBtn = document.getElementById("compare");
const resultTxt = document.getElementById("result");
let isAsc = false;
let dataGlobal;
let currName;
document.getElementById("headings").style.color = "orange";

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");
    console.log(rows);

    var info = [];

    for(let index = 0; index < rows.length; index++){
        let dataLinea = rows[index];
        itemColum = dataLinea.split(",");
        info.push({ 
            Nombre: itemColum[0], 
            columnaA: itemColum[1], 
            columnaB: itemColum[2], 
            columnaC: itemColum[3], 
            columnaD: itemColum[4], 
            columnaE: itemColum[5],
            columnaF: itemColum[6],
            columnaG: itemColum[7],
            columnaH: itemColum[8],
            columnaI: itemColum[9],
            columnaJ: itemColum[10]});
    }

    // return the array
    return info;
}

function generateTable(table, data) {
    for (let e of data) {
        let row = table.insertRow();
        for (k in e) {
            let text = "";
            let cell = row.insertCell();
            if (e[k].length <= 2) {

                text = document.createTextNode((e[k]) / 10);
            } else {
                text = document.createTextNode(e[k]);
            }
            cell.appendChild(text);
        }
    }
}

function generateTableConsoleLog() {
    for (let e of data) {
        let row = table.insertRow();
        for (k in e) {
            let cell = row.insertCell();
            let text = document.createTextNode(e[k]);
            cell.appendChild(text);
        }
    }
}

function sortResults(attr) {
    if (isAsc) {
        dataGlobal.sort(function (a, b) {
            return a[attr] - b[attr];
        });
        table.innerHTML = "";
        generateTable(table, dataGlobal);
    } else if (!isAsc) {
        dataGlobal.sort(function (a, b) {
            return b[attr] - a[attr];
        });
        table.innerHTML = "";
        generateTable(table, dataGlobal);

    }
    console.log(dataGlobal);
}

items.addEventListener("click", function (f) {
    let attr = f.target.id;
    console.log(attr);
    isAsc = !isAsc;
    sortResults(attr);
});

compareBtn.addEventListener("click", function () {
    let name1 = sel1.options[sel1.selectedIndex].text;
    let k = kInput.value;
    let Obj1 = [];
    for (var i = 0; i < dataGlobal.length; i++) {
        if (name1 === dataGlobal[i].Nombre) {
            Obj1 = dataGlobal[i];
        }
    }
    let Arr1 = Object.values(Obj1);
    let Arr1s = Arr1.splice(1);
    currName = 0;
    let cosineArr = [];
    while (currName < dataGlobal.length) {
        let Obj2 = [];

        for (var i = 0; i < dataGlobal.length; i++) {
            if (i === currName) {
                Obj2 = dataGlobal[i];
            }
        }

        let Arr2 = Object.values(Obj2);
        let Arr2s = Arr2.splice(1);
        let result = [Arr2[0], cosineSimil(Arr1s, Arr2s)];
        cosineArr.push(result);
        currName++;
    }


    //QUITARLE LA SIMILITUD COSENO PROPIA
    for (let i = 0; i < cosineArr.length; i++) {
        if (cosineArr[i][1] >= 0.99) {
            cosineArr.splice(i, 1);
        }
    }

    let orderedCosineArr = cosineArr.sort((a, b) => b[1] - a[1])
    console.log(orderedCosineArr);
    let KNNArr = orderedCosineArr.splice(0, k);
    let names = "";
    index = 1;
    KNNArr.forEach(element => {
        let name = `<br>${index}.${element[0]}: distancia de: ${1 - element[1]}`;
        index++;
        names += name;
    });
    resultTxt.innerHTML = `Los ${k} vecinos más cercanos de ${name1}, son:${names}`
    //console.log(KNNArr);
});

function cosineSimil(Arr1, Arr2) {
    let d = dotProduct(Arr1, Arr2);
    let m1 = magnitude(Arr1);
    let m2 = magnitude(Arr2);
    let result = d / (m1 * m2);
    
    return result;
}

function dotProduct(a, b) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}
function magnitude(a) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
        sum += Math.pow(a[i], 2);
    }
    let result = Math.sqrt(sum);
    return result;
}
calculator.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = excel.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        dataGlobal = data;
        generateTable(table, data);
        fillSelects(data);

    };
    function fillSelects(dataGlobal) {
        for (var i = 0; i < dataGlobal.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = dataGlobal[i].Nombre;
            opt.value = dataGlobal[i].Nombre;
            sel1.appendChild(opt);
        }
    }

    reader.readAsText(input);

});