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
        <h4 class="mb-4 text-center">${nextQuestion.question}</h4>
        <div id="answers-container" class="answers-container">
            <div class="answer-container p-3 d-flex"><h5 class="me-5">A</h5><p id="answer-a" >${nextQuestion.correct_answer}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="me-5">B</h5><p id="answer-b" >${nextQuestion.incorrect_answers[0]}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="me-5">C</h5><p id="answer-c" >${nextQuestion.incorrect_answers[1]}</p></div>
            <div class="answer-container p-3 d-flex"><h5 class="me-5">D</h5><p id="answer-d" >${nextQuestion.incorrect_answers[2]}</p></div>
        </div>
            `;
        } else if (nextQuestion.type === "boolean") {
        nextQuestionContainer.innerHTML = `
        <h3 class="mb-4 text-center">QUESTION n° ${quizz.indexOf(nextQuestion) + 1}
        </h3>
        <h4 class="mb-3 text-center">${nextQuestion.question}</h4>
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
        translateX: "-75vw",  
        duration : 3000,
        direction : "normal"
    });
    // FIN

    const answerContainers = document.querySelectorAll('.answer-container');

    answerContainers.forEach(container => {
        // On met un écouteur d'évènement au mousehover sur chaque case de réponse, pour modifier le pointeur de la souris.
        container.addEventListener('mouseover', () => {
            container.style.cursor = 'pointer';
            container.classList.add('bg-primary'); 
        });

        container.addEventListener('mouseleave', () => {
            container.classList.remove('bg-primary'); 
        });

        // On met un écouteur d'évènement au click sur chaque case de réponse, pour passer à la prochaine question et enregistrer la réponse de l'utlisateur.
        container.addEventListener('click', () => {
            console.log('clicked');
            console.log(container.childNodes);
            playerAnswers.push(container.childNodes[1].innerHTML);
            nextQuestionContainer.style.transform = 'none';
            if(quizz.indexOf(nextQuestion) < quizz.length - 1){
                // TENTATIVE d'enchaîne une dexième animation faisant partir la fenetre de question par la gauche, mais ça marche pas/
                // anime({
                //     targets: nextQuestionContainer,
                //     translateX: "-100vw",  
                //     duration : 3000,
                //     direction : "normal"
                // });
                // setTimeout(() => {
                //     console.log("Retardée d'une seconde.");
                //     displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
                //   }, "3000");
                // FIN
                  displayQuestion(quizz, quizz[quizz.indexOf(nextQuestion) + 1]);
            } else {
                announceGameResults();
            }
        });
    });
}

makeLeaveAnimation = () => {

}

announceGameResults = () => {
    // On efface la div qui posent les questions, on n'en aura plus besoin.
    nextQuestionContainer.style.display = 'none';

    // Calcul des bonnes réponses
    let nbCorrectAnswers = computeResults(playerAnswers, correctAnswers);
    let score = ((nbCorrectAnswers/correctAnswers.length)*10).toFixed(2);
    console.log("Nombres ? => " + nbCorrectAnswers);    

    // On affiche les réponses du joueur en regard des bonnes réponses.
    const resultsContainer = document.createElement('div');
    resultsContainer.setAttribute('id', 'results-container');
    mainContainer.appendChild(resultsContainer);
    resultsContainer.innerHTML = `  <div class="score-announce">

                                        <h1 class="text-danger">
                                            SCORE ${score}
                                        </h1>

                                        </div>
                                        <div class="answers-lists">
                                            <div>
                                                <ul id="questions-title">
                                                    <li class="bg-info mb-3"><h5 class="p-2">QUESTIONS</h5></li>
                                                </ul>
                                            </div>                                           
                                            <div>
                                                <ul id="correct-answers">
                                                    <li class="bg-info mb-3"><h5 class="p-2">ANSWERS</h5></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <ul id="player-answers">
                                                  <li class="bg-info mb-3"><h5 class="p-2">PLAYER'S</h5></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="scoring-options" class="my-3 scoring-options">
                                       <button id="replay-button" class="btn-success rounded-pill">REPLAY ?</button>
                                       <button id="record-button" class="btn-danger rounded-pill">Record score</button>
                                    </div>
                                    `;

    // Affichage des réponses du joueur
    const questionsUl = document.getElementById('questions-title');
    const playerUl = document.getElementById('player-answers');
    const correctUl = document.getElementById('correct-answers');

    for(let i = 0 ; i < correctAnswers.length ; i++){
        const liQuestion = document.createElement('li');
        questionsUl.appendChild(liQuestion);
        liQuestion.innerHTML = `Q${i+1}`;

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

    const replayButton = document.getElementById('replay-button');
    replayButton.addEventListener('click', () => {
        document.location.reload(true);
    });

    const recordButton = document.getElementById('record-button');
    recordButton.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
        ranking(score, nbCorrectAnswers, correctAnswers.length);
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

ranking = (score, nbCorrectAnswers, nbQuestions) => {
    // Log de vérif
    console.log("YOUAIPE ! YEP ! YUP !");

    // Créer une div pour afficher les éléments de score
    const recordingContainer = document.getElementById('recording-container');
    const recordOkButton = document.getElementById('record-ok-button');
    const recordsList = document.getElementById('records-list');
    const inputRecord = document.getElementById('input-record');
    recordingContainer.style.display = 'grid';

    // Afficher la liste des scores déjà enregistrés

    // Enregistrer un pseudo pour le joueur + afficher son score dans la liste
    recordOkButton.addEventListener('click', () => {
        localStorage.setItem(inputRecord.value, `${score} points / ${nbQuestions} questions > ${nbCorrectAnswers} answers.`);
        console.log(localStorage.entries);
        for(key in localStorage) {
            if(localStorage.getItem(key) !== null){
                const liRecord = document.createElement('li');
                recordsList.appendChild(liRecord);
                liRecord.innerHTML = `${key} : ${localStorage.getItem(key)}`;
            }
        }
    });
}

welcomeScreen = () => {
    anime({
        targets: document.getElementById('title-container'),
        keyframes: [
                    {   
                        delay: 1500,
                        scale: 0.1,
                        rotate: 180,
                        duration: 2000
                    },
                    {   
                        rotate: 0,
                        scale: 2
                    },
                    {
                        delay: 500,
                        scale: 1
                    }
                ],
                easing: 'easeOutElastic(1, .1)',
      });
}

perform = () => {
    console.clear();
    welcomeScreen();
    getQuizzSize();
}

perform();