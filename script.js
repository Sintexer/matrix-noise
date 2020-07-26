const formsMax = 7;
let noiseMax = 0;

document.onload = (() => {
    generateFormList();
    addValueBubbles();
})();


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateFormList() {
    let li = document.createElement("li");
    let list = document.createElement("ul");
    list.setAttribute("id", "formsList");
    list.setAttribute("class", "verticalList");
    li.appendChild(list);
    document.querySelector(".verticalList").prepend(li);
    for (let i = 0; i < formsMax; ++i)
        generateForm();
}

function generateForm() {
    let li = document.createElement("li");
    let form = document.createElement("form");
    form.setAttribute("name", "noiseForm");
    let fieldSet = document.createElement("fieldset");
    let p1 = document.createElement("p"),
        p2 = document.createElement("p");
    let div = document.createElement("div");
    div.setAttribute("class", "rangeInputWrap");
    p1.innerHTML = "Noise value: ";
    p1.setAttribute("class", "caption");
    p2.innerHTML = "Coefficient (%): ";
    p2.setAttribute("class", "caption");
    let input2 = document.createElement("input");
    
    addDropDownListElements(p1);

    input2.setAttribute("type", "range");
    input2.setAttribute("name", "noiseCoef");
    input2.setAttribute("min", "0");
    input2.setAttribute("max", "100");
    input2.setAttribute("step", "5");
    input2.setAttribute("placeholder", "20");
    input2.setAttribute("class", "inputRange");

    let bubble = document.createElement("output");
    bubble.setAttribute("class", "bubble")
   // p1.appendChild(input1);
    p2.appendChild(bubble);
    div.appendChild(p2);
    div.appendChild(input2);
    fieldSet.appendChild(p1);
    fieldSet.appendChild(div);
    form.appendChild(fieldSet);
    li.appendChild(form);
    document.getElementById("formsList").appendChild(li);
}

function addValueBubbles() {
    const wraps = document.querySelectorAll(".rangeInputWrap");
    wraps.forEach(wrap => {
        const bubble = wrap.querySelector(".bubble");
        const range = wrap.querySelector(".inputRange");

        range.addEventListener("input", () => {
            setBubble(range, bubble);
        });
        setBubble(range, bubble);
    })
}

function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = newVal+"%";
}

function processForms() {
    try {
        let table = document.getElementById("matrix");
        let rows = document.inputForm.jis.value;
        let cols = document.inputForm.cols.value;
        while (table.hasChildNodes()) {
            table.removeChild(table.firstChild);
        }
        addTbody(table, rows, cols);
        let noiseForms = document.getElementsByName("noiseForm");
        if (noiseForms.length > 0) {
            noiseMax = 0;
            for (let form of noiseForms) {
                noiseMax += +form.shapes.value;
            }
            console.log(noiseMax);
            for (let form of noiseForms) {
                makeNoise(form, rows, cols);
            }
        }
        tableInColor();
    } catch (exceprion) {

    }
}

function makeNoise(form, rows, cols) {
    try {
        let noiseCoef = form.noiseCoef.value;
        let noiseVal = form.shapes.value;
        let steps = (noiseCoef / 100) * rows * cols;

        addNoise(steps, noiseVal);
    } catch (e) {

    }
}

function addTbody(table, rows, cols) {
    let tbody = document.createElement("tbody");
    for (let i = 0; i < rows; ++i) {
        let newRow = document.createElement("tr");
        for (let j = 0; j < cols; ++j) {
            let newTd = newRow.insertCell(j);
            newTd.innerHTML = "0";
        }
        tbody.appendChild(newRow);
    }
    table.appendChild(tbody);
}

function addNoise(steps, noiseVal) {
    let table = document.getElementById("matrix");
    let alreadyNoised = [];
    while (steps-- > 0) {
        let row = getRandomInt(table.children[0].children.length);
        let col = getRandomInt(table.children[0].children[0].children.length);
        let td = table.children[0].children[row].children[col];
        let cell = {"row": row, "col": col};
        let contains = false;
        for (let i = 0; i < alreadyNoised.length; ++i) {
            if (alreadyNoised[i].col === cell.col && alreadyNoised[i].row === cell.row) {
                contains = true;
                break
            }
        }
        if (!contains) {
            td.innerHTML = +td.innerHTML + (+noiseVal);
            alreadyNoised.push(cell);
        } else
            ++steps;
    }
}

function tableInColor() {
    let table = document.getElementById("matrix");
    let rowMax = table.children[0].children.length;
    let colMax = table.children[0].children[0].children.length;
    let matrix = table.children[0].children;

    for (let i = 0; i < rowMax; ++i) {
        for (let j = 0; j < colMax; ++j) {
            let red = 13,
                green = 198,
                blue = 41;
            let td = matrix[i].children[j];

            let coef = td.innerHTML / noiseMax;
            console.log("Coef:" + coef);
            let r = 255 - (255 - red) * coef,
                g = 255 - (255 - green) * coef,
                b = 255 - (255 - blue) * coef;
            td.style = "background-color: rgb(" + r + ", " + g + ", " + b + ");"
        }
    }
}

function contains(arr, elem, from) {
    return arr.indexOf(elem, from) != -1;
}

function addDropDownListElements(parent){
    let selection=document.createElement("select");
    selection.setAttribute("name", "shapes");
    
    const enums =['',1,2,3,4,5,6,7];
    for (var i=0; i<enums.length; ++i) {
        let option=document.createElement("option");
        option.innerHTML=enums[i];
        selection.appendChild(option);
    }

    parent.appendChild(selection);

}