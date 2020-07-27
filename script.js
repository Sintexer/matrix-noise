const formsMax = 7;
let noiseMax = 0;
let changeTdContent,
    paintTd,
    findNoiseMax;

const imagesPath = "images/shapes/";
const imagesRelative = ["rectangle.png", "circle.png", "romb.png", "triangle1.png",
    "triangle2.png", "triangle3.png", "triangle4.png"];
let images = imagesRelative.map(pathRel => imagesPath+pathRel);

class TdContentChanger {
    static replaceTdContent(td, newValue) {
        td.innerHTML = newValue;
    }
    static concatTdContent(td, newValue){
        if(td.innerHTML === '0')
            td.innerHTML = newValue;
        else {
            if (td.innerHTML.length > 0)
                td.innerHTML += ', ';
            td.innerHTML += newValue;
        }
    }
    static noiseValBiggest(noiseForms){
        noiseMax = 0;
        for (let form of noiseForms) {
            if(+form.shapes.value > noiseMax)
                noiseMax = +form.shapes.value;
        }
    }

    static noiseValSum(noiseForms){
        noiseMax = 0;
        for (let form of noiseForms) {
            if(+form.shapes.value > 0)
                noiseMax += +form.shapes.value;
        }
    }
}

class TdContentPaint {
    static fillTableColors(table, rowMax, colMax, matrix) {
        for (let i = 0; i < rowMax; ++i) {
            for (let j = 0; j < colMax; ++j) {
                let red = 13,
                    green = 198,
                    blue = 41;
                let td = matrix[i].children[j];
                let values = td.innerHTML.split(', ').map(val => +val);
                let coef =  values.reduce((acc= 0, curr) => acc + curr)/ noiseMax;
                let r = 255 - (255 - red) * coef,
                    g = 255 - (255 - green) * coef,
                    b = 255 - (255 - blue) * coef;
                td.style.backgroundColor = "rgb(" + r + ", " + g + ", " + b + ")"
            }
        }
    }

    static fillTableImages(table, rowMax, colMax, matrix) {
        for (let i = 0; i < rowMax; ++i) {
            for (let j = 0; j < colMax; ++j) {
                let td = matrix[i].children[j];
                let indexes = td.innerHTML.split(", ");
                while(td.hasChildNodes())
                    td.removeChild(td.firstChild);

                if(indexes[0] !== '0') {
                    let step = 0;
                    for (let index of indexes){
                        let img = document.createElement("img");
                        img.setAttribute("src", images[+index-1]);
                        img.setAttribute("width", "100%");
                        img.setAttribute("height", "100%");
                        td.appendChild(img);
                        step+=10;
                    }
                }
            }
        }
    }
}

function switchTableType() {
    findNoiseMax = document.formFillType.tableFillType.value === "concat" ?
        TdContentChanger.noiseValSum :
        TdContentChanger.noiseValBiggest;
    changeTdContent = document.formFillType.tableFillType.value === "concat" ?
        TdContentChanger.concatTdContent :
        TdContentChanger.replaceTdContent;
    paintTd = document.formPaintType.tablePaintType.value === "colors" ?
        TdContentPaint.fillTableColors :
        TdContentPaint.fillTableImages;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateFormsList() {
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
    p2.innerHTML = "Coefficient (%): ";
    addDropDownListElements(p1);
    addRangeBubble(p2);
    div.appendChild(p2);
    addRangeInput(div);
    fieldSet.appendChild(p1);
    fieldSet.appendChild(div);
    form.appendChild(fieldSet);
    li.appendChild(form);
    document.getElementById("formsList").appendChild(li);
}

function processForms() {
    switchTableType();
    try {
        let table = document.getElementById("matrix");
        let rows = document.formMatrixSize.jis.value;
        let cols = document.formMatrixSize.cols.value;
        while (table.hasChildNodes()) {
            table.removeChild(table.firstChild);
        }
        addTbody(table, rows, cols);
        let noiseForms = document.getElementsByName("noiseForm");
        if (noiseForms.length > 0) {
            findNoiseMax(noiseForms);
            for (let form of noiseForms) {
                if(+form.shapes.value > 0)
                    makeNoise(form, rows, cols);
            }
        }
        fillTable();
    } catch (exceprion) {
        console.log("exc");
        console.log(exceprion.message)
    }
}

function makeNoise(form, rows, cols) {
    try {
        let noiseCoef = form.noiseCoef.value;
        let noiseVal = form.shapes.value;
        let steps = (noiseCoef / 100) * rows * cols;
        console.log(steps);
        addNoise(steps, noiseVal);
    } catch (e) {
        log(e.message);
    }
}

function addTbody(table, rows, cols) {
    let tbody = document.createElement("tbody");
    let newSize = calculateCellSize(rows, cols);
    for (let i = 0; i < rows; ++i) {
        let newRow = document.createElement("tr");
        for (let j = 0; j < cols; ++j) {
            let newTd = newRow.insertCell(j);
            newTd.innerHTML = "0";
            newTd.setAttribute("style", "padding: " + newSize + "px;");
        }
        tbody.appendChild(newRow);
    }
    table.appendChild(tbody);
}

function calculateCellSize(rows, cols) {
    let newSize;
    console.log(rows, cols);
    newSize = (document.getElementsByClassName("content-space")[0].clientHeight) / rows / 2.3;
    console.log(newSize);
    return newSize;
}

function addNoise(steps, noiseVal) {
    let table = document.getElementById("matrix");
    let alreadyNoised = [];
    while (steps-- > 0) {
        console.log("step");
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
            changeTdContent(td, noiseVal);
            alreadyNoised.push(cell);
        } else
            ++steps;
    }
}

function fillTable() {
    let table = document.getElementById("matrix");
    let rowMax = table.children[0].children.length;
    let colMax = table.children[0].children[0].children.length;
    let matrix = table.children[0].children;
    paintTd(table, rowMax, colMax, matrix);
}

function contains(arr, elem, from) {
    return arr.indexOf(elem, from) != -1;
}

function addRangeBubble(parent) {
    let bubble = document.createElement("output");
    bubble.setAttribute("class", "bubble")
    parent.appendChild(bubble);
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
    bubble.style.left = newVal+"%";
}

function addRangeInput(parent){
    let input = document.createElement("input");

    input.setAttribute("type", "range");
    input.setAttribute("name", "noiseCoef");
    input.setAttribute("min", "0");
    input.setAttribute("max", "100");
    input.setAttribute("step", "1");
    input.setAttribute("placeholder", "20");
    input.setAttribute("class", "inputRange");
    parent.appendChild(input);
}

function addDropDownListElements(parent){
    let selection=document.createElement("select");
    selection.setAttribute("name", "shapes");

    const values =['',1,2,3,4,5,6,7];
    for (let i=0; i<values.length; ++i) {
        let option=document.createElement("option");
        let div = document.createElement("div");
        div.setAttribute("class", "optionDiv");
        option.innerHTML=values[i];
        selection.appendChild(option);
    }
    parent.appendChild(selection);
}

function onLoad() {
    switchTableType();
    generateFormsList();
    addValueBubbles();
}