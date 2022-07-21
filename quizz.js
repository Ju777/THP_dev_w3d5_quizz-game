const inputButton = document.getElementById('input-button');
const userInput = document.getElementById('user-input');
const list = document.getElementById('tmp-list');
const inputArea = document.getElementById('input-area');
const nextQuestionContainer = document.getElementById('next-question-container');
const mainContainer = document.getElementById('main-container');
const playerAnswers = [];
const correctAnswers = [];

// const nextQuestionContainer = document.getElementById('next-question-container');

try{
    getData = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayQuestion(data.results, data.results[0]);
    }
}catch(error){
    console.log("Erreur de fetching : " + error.message);
}

getQuizzSize = () => {
    inputButton.addEventListener('click', () => {
        let size = userInput.value;
        inputToUrl(size);
        inputArea.style.display = "none";

    });
}

inputToUrl = (quizzSize) => {
    let url = "https://opentdb.com/api.php?amount=" + quizzSize;
    console.log(url);
    getData(url);
}

displayQuestion = async (quizz, nextQuestion) => {

    console.log(nextQuestion);

    // La div de la nouvelle question
    nextQuestionContainer.innerHTML =   `<h3>Question n° ${quizz.indexOf(nextQuestion) + 1} : ${nextQuestion.question}</h3>

                                        <div id="answer-a">${nextQuestion.correct_answer}</div>
                                        <div id="answer-b">${nextQuestion.incorrect_answers[0]}</div>
                                        <div id="answer-c">${nextQuestion.incorrect_answers[1]}</div>
                                        <div id="answer-d">${nextQuestion.incorrect_answers[2]}</div>
                                        `;
    nextQuestionContainer.style.display = 'block';
    correctAnswers.push(nextQuestion.correct_answer);
    // FIN

    // Animation d'entrée dans la fenêtre
    anime({
        targets: nextQuestionContainer,
        translateX: "10vw",  
        // rotate : 360,
        duration : 5000,
        direction : "normal"
        // autoplay : false,
    });
    // FIN

    // On met un écouteur d'évènement sur chaque case de réponse :
    const answerA = document.getElementById('answer-a');
    const answerB = document.getElementById('answer-b');
    const answerC = document.getElementById('answer-c');
    const answerD = document.getElementById('answer-d');

    answerA.addEventListener('click', () => {
        playerAnswers.push(answerA.innerHTML);
        nextQuestionContainer.style.transform = 'none';
        if(quizz.indexOf(nextQuestion) < quizz.length - 1){
            displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
        } else {
            announceGameResults();
        }
    });
    answerB.addEventListener('click', () => {
        playerAnswers.push(answerB.innerHTML);
        nextQuestionContainer.style.transform = 'none';
        if(quizz.indexOf(nextQuestion) < quizz.length - 1){
            displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
        } else {
            announceGameResults();
        }
    });
    answerC.addEventListener('click', () => {
        playerAnswers.push(answerC.innerHTML);
        nextQuestionContainer.style.transform = 'none';
        if(quizz.indexOf(nextQuestion) < quizz.length - 1){
            displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
        } else {
            announceGameResults();
        }
    });
    answerD.addEventListener('click', () => {
        playerAnswers.push(answerD.innerHTML);
        nextQuestionContainer.style.transform = 'none';
        if(quizz.indexOf(nextQuestion) < quizz.length - 1){
            displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
        } else {
            announceGameResults();
        }
    });
    // FIN
}

announceGameResults = () => {
    // On efface la div qio posent les questions, on n'en aura plus besoin.
    nextQuestionContainer.style.display = 'none';

    // Calcul des bonnes réponses
    let nbCorrectAnswers = computeResults(playerAnswers, correctAnswers);
    console.log("Nombres ? => " + nbCorrectAnswers);

    // On affiche les réponses du joueur en regard des bonnes réponses.
    const resultsContainer = document.createElement('div');
    resultsContainer.setAttribute('id', 'results-container');
    resultsContainer.style.display = 'flex';
    mainContainer.appendChild(resultsContainer);
    resultsContainer.innerHTML = `<p>
                                    Es-tu le grand gagnant ?<br/>
                                    Tu as ${nbCorrectAnswers} bonnes réponses !</p>
                                 <div>
                                    <ul id="player-answers">
                                    </ul>
                                 </div>
                                    
                                 <div>
                                    <ul id="correct-answers">
                                    </ul>
                                 </div>
    
                                 `;
    

    // Affichage des réponses du joueur  
    const playerUl = document.getElementById('player-answers');
    for(let i = 0 ; i < playerAnswers.length ; i++){
        const li = document.createElement('li');
        playerUl.appendChild(li);
        li.innerHTML = playerAnswers[i];
    }

    const correctUl = document.getElementById('correct-answers');
    for(let i = 0 ; i < correctAnswers.length ; i++){
        const li = document.createElement('li');
        correctUl.appendChild(li);
        li.innerHTML = correctAnswers[i];
    }

    const replayButton = document.createElement('button');
    mainContainer.appendChild(replayButton);
    replayButton.innerHTML = "REJOUER ?";
    replayButton.addEventListener('click', () => {
        document.location.reload(true);
    });
}

computeResults = (playerAnswers, correctAnswers) => {
    let count = 0;
    for(let i = 0 ; i < playerAnswers.length ; i++){
        if(playerAnswers[i] === correctAnswers[i]){
            count++;
        }
    }
    return count;
}



perform = () => {
    console.clear();
    getQuizzSize();
}

perform();