window.onload = init;

let myData = {};
let page = 0;
let score = 0;
let userAnswers = [];
let output = document.getElementById('output');

function init() {
    getJSON('http://myjson.dit.upm.es/api/bins/rb7', function (response) {
        myData = response;
        buildPage();
    });
}

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status == 200) {
            callback(xhr.response);
        }
    }
    xhr.open('get', url, true);
    xhr.send();
}

function buildPage() {
    let p = myData[page];
    let html = '<h1>Welcome to our quiz</h1>';
    html += '<div class="question">' + p.question + '</div><br>';
    for (let i = 0; i < p.answers.length; i++) {
        let answer = i == p.correct ? true : false;
        let selectedClass = userAnswers[page] == i ? 'notSelected selected' : 'notSelected';
        html += '<div class="' + selectedClass + '" data-answer="' + answer + '" data-index="' + i + '">' + p.answers[i] + '</div>';
    }
    output.innerHTML = html;
}

function move(p) {
    if (p < 0) {
        p = 0;
    }
    if (p >= myData.length) {
        document.getElementById('next').style.display = "none";
        summarize();
    } else {
        page = p;
        document.getElementById('next').style.display = "block";
        buildPage();
    }
}

function summarize() {
    score = 0;
    page = myData.length;
    let html = '<div id="summary"><h2>Summary</h2>';
    for (let i = 0; i < myData.length; i++) {
        html += 'Question ' + (i + 1) + ' is ';
        if (myData[i].correct == userAnswers[i]) {
            html += ' correct <br>';
            score++;
        } else {
            html += ' wrong <br>';
        }
    }
    html += '<span>Your score is ' + score + ' out of ' + myData.length + '</span></div>';
    output.innerHTML = html;
}

output.addEventListener('click', function () {
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].classList.remove('selected');
    }
    if (event.target.classList.contains('notSelected')) {
        userAnswers[page] = Number(event.target.dataset.index);
        event.target.classList.add('selected');
    }
})

document.getElementById('prev').addEventListener('click', function () {
    move(page - 1);
});
document.getElementById('next').addEventListener('click', function () {
    move(page + 1);
});