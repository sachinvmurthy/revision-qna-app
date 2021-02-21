var trueAnswers = []
var questionStack = []
var questionList = []
var questionNumber = 1
var trueMap = new Map();
var userMap = new Map();

var base64;

function onTextSubmit() {
    var submitButton = document.getElementById("submitButton");


    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response = JSON.parse(this.responseText);
            updateQnAStack(response);
            if (questionStack.length > 0) {
                console.log(" question stack updated ")
                hideLoader(submitButton);
            }
        }
    });

    xhr.open("POST", "http://18.188.61.131/qna/getqna/text");
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({ "text": document.getElementById("input-text").value });
    xhr.send(data);

}

function hideLoader(submitButton) {
    var loaderspan1 = document.getElementById('loader1');
    var loaderspan2 = document.getElementById('loader2');
    var loaderspan3 = document.getElementById('loader3');
    loaderspan1.style.display = "none";
    loaderspan2.style.display = "none";
    loaderspan3.style.display = "none";

    submitButton.classList.remove('disabled')

    document.getElementById('apiload').innerHTML = "Done";

}


function updateQnAStack(response) {
    for (var i = 0; i < response.length; i++) {
        questionStack.push(response[i].question)
        questionList.push(response[i].question)
        trueAnswers.push(response[i].answer)
        trueMap[response[i].question] = response[i].answer
        userMap[response[i].question] = ''
    }
}


var user_answers = []

function getInputValue() {
    var inputVal = document.getElementById("answer_value").value;
    user_answers.push(inputVal)
    var currentQuestion = document.getElementById("questionLabel").textContent;
    userMap[currentQuestion] = inputVal
    document.getElementById("answer_value").value = '';
    getNextQuestion();
}


function getNextQuestion() {

    if (questionNumber > questionList.length) {
        evaulate();
    }
    if (questionNumber == questionList.length) {
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('questionsClose').style.display = 'none';
        document.getElementById('saveAnswer').innerHTML = 'Evaluate';
    }
    document.getElementById("answer_value").value = '';
    var str = "Question "
    document.getElementById("questionNumber").innerHTML = str.concat(questionNumber);
    document.getElementById("questionLabel").innerHTML = questionStack.pop();
    questionNumber = questionNumber + 1;

}

function evaulate() {
    $('#questionModalCenteredScrollable').modal('hide');
    $('#evaluationModal').modal('show');
    var container = document.getElementById('evaluationContent');
    var correctCount = 0;
    for (var i = 0; i < questionList.length; i++) {
        var question = questionList[i];
        var trueAnswer = trueMap[question];
        var userAnswer = userMap[question];
        if (trueAnswer.toUpperCase() == userAnswer.toUpperCase()) {
            container.appendChild(getCorrectAnswerTemplate(question, userAnswer));
            correctCount++;
        } else {
            container.appendChild(getWrongAnswerTemplate(question, userAnswer, trueAnswer));
        }
    }
    var header = document.getElementById('card-eval-header');
    header.innerHTML += correctCount + " out of " + questionList.length + " correctly";
}

function getCorrectAnswerTemplate(question, answer) {
    var cardElement = document.createElement('div');
    cardElement.innerHTML = '<div class="card"><div class="card-header correct-answer">' + question + '</div><div class="card-body"><p class="card-text"><span>' + answer + '</span></p></div></div>';
    return cardElement;
}

function getWrongAnswerTemplate(question, userAnswer, trueAnswer) {
    var cardElement = document.createElement('div');
    cardElement.innerHTML = '<div class="card"><div class="card-header wrong-answer">' + question + '</div><div class="card-body"><p class="card-text"><p><span class="text-correct">' + trueAnswer + '</span></p><p><span class="text-incorrect">' + userAnswer + '</span></p></p></div></div>';
    return cardElement;
}

function convertToBase64() {
    var selectedFile = document.getElementById("pdfFilePicker").files;
    var pdfSubmitButton = document.getElementById("submit-pdf-button");
    var textSubmitButton = document.getElementById("submit-text-button");

    if (selectedFile.length > 0) {
        var fileToLoad = selectedFile[0];
        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;

        };
        fileReader.readAsDataURL(fileToLoad);
    }
    textSubmitButton.classList.add('disabled')
    pdfSubmitButton.classList.remove('disabled')
}

function onPdfSubmit() {
    console.log(base64)
    var base64stripped = base64.split(',')[1];
    var data = JSON.stringify({ "base64encoded": base64stripped });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            var response = JSON.parse(this.responseText);
            updateQnAStack(response);
            if (questionStack.length > 0) {
                console.log(" question stack updated ")
                hideLoader(submitButton);
            }

        }
    });

    xhr.open("POST", "http://18.188.61.131/getqna/pdf");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

$(document).ready(function () {
    $("#uploadModalCenteredScrollable, #startquiz, #questionModalCenteredScrollable, #evaluationModal").modal({
        show: false,
        backdrop: 'static'
    });
});