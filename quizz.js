const inputButton = document.getElementById('input-button');
const userInput = document.getElementById('user-input');
const list = document.getElementById('tmp-list');
const inputArea = document.getElementById('input-area');
const nextQuestionContainer = document.getElementById('next-question-container');
const mainContainer = document.getElementById('main-container');
const inputContainer = document.getElementById('input-container');
const playerAnswers = [];
const correctAnswers = [];
const message = document.getElementById('message');

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
    userInput.addEventListener('change', () => {
        if (userInput.value <= 0){
            console.log("trop petit");
            message.innerHTML = 'TROP PETIT';
            inputButton.classList.add('input-button');         
        } else if (userInput.value > 100){
            console.log("trop grand");
            message.innerHTML = 'TROP GRAND';
            inputButton.classList.add('input-button');         
        } else {
            console.log("pas de problème");
            message.innerHTML = '';    
            inputButton.classList.remove('input-button'); 
        }
    });

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
    if(nextQuestion.type === "multiple"){
    nextQuestionContainer.innerHTML = `
        <h3 class="mb-4 text-center">QUESTION n° ${quizz.indexOf(nextQuestion) + 1}
        </h3>
        <h4 class="mb-3 text-center">${nextQuestion.question}</h4>
        <div id="answers-container" class="answers-container">
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">A</h5><p id="answer-a" >${nextQuestion.correct_answer}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">B</h5><p id="answer-b" >${nextQuestion.incorrect_answers[0]}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">C</h5><p id="answer-c" >${nextQuestion.incorrect_answers[1]}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">D</h5><p id="answer-d" >${nextQuestion.incorrect_answers[2]}</p></div>
        </div>
            `;
        } else if (nextQuestion.type === "boolean") {
        nextQuestionContainer.innerHTML = `
        <h3 class="mb-4 text-center">QUESTION n° ${quizz.indexOf(nextQuestion) + 1}<br/>
        ${nextQuestion.question}</h3>
        <div id="answers-container" class="answers-container">
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">A</h5><p id="answer-a" >${nextQuestion.correct_answer}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="mx-2">B</h5><p id="answer-b" >${nextQuestion.incorrect_answers[0]}</p></div>
        </div>`
        }
    nextQuestionContainer.style.display = 'block';
    correctAnswers.push(nextQuestion.correct_answer);
    // FIN

    // Animation d'entrée dans la fenêtre
    anime({
        targets: nextQuestionContainer,
        translateX: "25vw",  
        duration : 2000,
        direction : "normal"
    });
    // FIN

    const answerContainers = document.querySelectorAll('.answer-container');

    answerContainers.forEach(container => {
        // On met un écouteur d'évènement au mousehover sur chaque case de réponse, pour modifier le pointeur de la souris.
        container.addEventListener('mouseover', () => {
            container.style.cursor = 'pointer';
        });

        // On met un écouteur d'évènement au click sur chaque case de réponse, pour passer à la prochaine question et enregistrer la réponse de l'utlisateur.
        container.addEventListener('click', () => {
            console.log('clicked');
            console.log(container.childNodes);
            playerAnswers.push(container.childNodes[1].innerHTML);
            nextQuestionContainer.style.transform = 'none';
            if(quizz.indexOf(nextQuestion) < quizz.length - 1){
                displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
            } else {
                announceGameResults();
            }
        });
    });

    // EN ATTENTE d'etre sûr que le reste marche jusqu'au bout
    // On met un écouteur d'évènement au click sur chaque case de réponse, pour enregistrer la réponse et passer à la question suivante.
    // const answerA = document.getElementById('answer-a');
    // const answerB = document.getElementById('answer-b');
    // const answerC = document.getElementById('answer-c');
    // const answerD = document.getElementById('answer-d');

    // answerContainers[0].addEventListener('click', () => {
    //     playerAnswers.push(answerA.innerHTML);
    //     nextQuestionContainer.style.transform = 'none';
    //     if(quizz.indexOf(nextQuestion) < quizz.length - 1){
    //         displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
    //     } else {
    //         announceGameResults();
    //     }
    // });
    // answerContainers[1].addEventListener('click', () => {

    //     playerAnswers.push(answerB.innerHTML);
    //     nextQuestionContainer.style.transform = 'none';
    //     if(quizz.indexOf(nextQuestion) < quizz.length - 1){
    //         displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
    //     } else {
    //         announceGameResults();
    //     }
    // });
    // answerContainers[2].addEventListener('click', () => {
    //     playerAnswers.push(answerC.innerHTML);
    //     nextQuestionContainer.style.transform = 'none';
    //     if(quizz.indexOf(nextQuestion) < quizz.length - 1){
    //         displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
    //     } else {
    //         announceGameResults();
    //     }
    // });
    // answerContainers[3].addEventListener('click', () => {
    //     playerAnswers.push(answerD.innerHTML);
    //     nextQuestionContainer.style.transform = 'none';
    //     if(quizz.indexOf(nextQuestion) < quizz.length - 1){
    //         displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
    //     } else {
    //         announceGameResults();
    //     }
    // });
    // FIN DE EN ATTENTE
}

announceGameResults = () => {
    // On efface la div qui posent les questions, on n'en aura plus besoin.
    nextQuestionContainer.style.display = 'none';

    // Calcul des bonnes réponses
    let nbCorrectAnswers = computeResults(playerAnswers, correctAnswers);
    console.log("Nombres ? => " + nbCorrectAnswers);

    // On affiche les réponses du joueur en regard des bonnes réponses.
    const resultsContainer = document.createElement('div');
    resultsContainer.setAttribute('id', 'results-container');
    // resultsContainer.style.display = 'flex';
    mainContainer.appendChild(resultsContainer);
    resultsContainer.innerHTML = `  <div class="score-announce">
                                        <h1 class="text-danger">
                                             SCORE ${nbCorrectAnswers} / ${correctAnswers.length}
                                        </h1>
                                    </div>
                                    <div class="answers-lists">
                                        <div>
                                            <ul id="questions-title">
                                                <li class="bg-info mb-3">QUESTIONS</li>
                                            </ul>
                                        </div>                                           
                                        <div>
                                            <ul id="correct-answers">
                                            <li class="bg-info mb-3">CORRECTION</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <ul id="player-answers">
                                            <li class="bg-info mb-3">JOUEUR</li>
                                            </ul>
                                        </div>
                                    </div>`;

    // Affichage des réponses du joueur
    const questionsUl = document.getElementById('questions-title');
    const playerUl = document.getElementById('player-answers');
    // for(let i = 0 ; i < playerAnswers.length ; i++){
    //     const li = document.createElement('li');
    //     playerUl.appendChild(li);
    //     li.innerHTML = playerAnswers[i];
    // }

    const correctUl = document.getElementById('correct-answers');
    for(let i = 0 ; i < correctAnswers.length ; i++){
        const liQuestion = document.createElement('li');
        questionsUl.appendChild(liQuestion);
        liQuestion.innerHTML = `Q${i}`;

        const liPlayer = document.createElement('li');
        playerUl.appendChild(liPlayer);
        liPlayer.innerHTML = playerAnswers[i];

        const liCorrect = document.createElement('li');
        correctUl.appendChild(liCorrect);
        liCorrect.innerHTML = correctAnswers[i];

        if (correctAnswers[i] === playerAnswers[i]) {
            liPlayer.style.backgroundColor = "green";
        }
         else {
            liPlayer.style.backgroundColor = "red";
        }
    }

    const replayButton = document.createElement('button');
    mainContainer.appendChild(replayButton);
    replayButton.innerHTML = "<h1>REPLAY ?</h2>";
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