let DATA = {
    amountOfQuestions: 2, // how many questions will actualy appear
    appContent:  [
        {
            type: `binary`,
            src: `../assets/images/homePage/tillder.png`,
            definition: `הגדרה של מושג כי מושג זה כיף`,
            answer: [// if you want two words put a dash between them, not more then 8 letters
            `מ`,
            `ו`,
            `ש`,
            `ג`,
            `-`,
            `א`
        ],
        },
        {
            type: `binary`,
            src: `../assets/images/homePage/tillder.png`,
            definition: `הגדרה של עוד מושג כי מושג זה כיף`,
            answer: [// if you want two words put a dash between them, not more then 8 letters
            `מ`,
            `ו`,
            `ש`,
            `ג`,
            `-`,
            `ב`
        ],
        },
    ],
};

let nTillhangCurrentQuestion = 0;
let nTillhangCorrectAnswers = 0;
let nCorrectAns = 0;
let nWrongAns = 0 
let arrTillhangQuestion;
const ALPHABET = [`א`,`ב`,`ג`,`ד`,`ה`,`ו`,`ז`,`ח`,`ט`,`י`,`כ`,`ל`,`מ`,`נ`,`ס`,`ע`,`פ`,`צ`,`ק`,`ר`,`ש`,`ת`];
const LOOSE_QUESTION = 6;
const PASSING_RATE = 0.5;
const AMOUNT_OF_TILLHANG_QUESTION = DATA.amountOfQuestions; // how many questions we want out of the array

/* loading function
--------------------------------------------------------------
Description: */
window.addEventListener("load", () => { 
    document.querySelector(`.loader`).classList.add(`fade`);
    arrTillhangQuestion = shuffle(DATA.appContent);
    createHangman();
});

/* tillhang
--------------------------------------------------------------
Description: start tillhang app*/
const createHangman = () => {
    nCorrectAns = 0;
    nWrongAns = 0 
    document.querySelector(`.tillhang`).innerHTML = "";
    let content = El("div", {classes: [`tillhangContainer`, `flexCenter`]},
        El("div",{cls: `tillhangTitle`}, `איש תלוי`),
        El("div",{cls: `tillhangPicContainer`},
            El("img",{classes: [`tillhangHanger`], attributes: {src: `../assets/images/tillhang/hanger0.svg`}}),
        ),
        El("div",{cls: `tillhangTitleDefinition`}, `הגדרה:`),
        El("div",{cls: `tillhangDefinition`}, arrTillhangQuestion[nTillhangCurrentQuestion].definition),
        El("div",{cls: `tillhangLetterSpace`},),
        El("div",{cls: `tillhangkeyBoard`},),
    );
    document.querySelector(`.tillhang`).append(content);
    let letterSpace;
    for(let i = 0; i < arrTillhangQuestion[nTillhangCurrentQuestion].answer.length; i++){
        if(arrTillhangQuestion[nTillhangCurrentQuestion].answer[i] === `-`){
            letterSpace = El("div",{classes: [`letterSpace`, `letterSpace${i}`, `letterSpaceDash`]});
            nCorrectAns++;
        } else {
            letterSpace = El("div",{classes: [`letterSpace`, `letterSpace${i}`]});
        }
        document.querySelector(`.tillhangLetterSpace`).append(letterSpace);
    }
    let keyBoardLetter;
    for(let j = 0; j < ALPHABET.length; j++){
        keyBoardLetter = El("div",{classes: [`keyboardLetter`, `${ALPHABET[j]}`], listeners: {click: checkLetter}}, ALPHABET[j]);
        document.querySelector(`.tillhangkeyBoard`).append(keyBoardLetter);
    }
}

/* checkLetter
--------------------------------------------------------------
Description: start tillhang app*/
const checkLetter = (event) => {
    let clickedLetter = event.currentTarget.classList[1];
    event.currentTarget.style.backgroundColor = "red";
    event.currentTarget.removeEventListener("click", checkLetter)
    let bWrong = true;
    for(let i = 0; i < arrTillhangQuestion[nTillhangCurrentQuestion].answer.length; i++){
        if(arrTillhangQuestion[nTillhangCurrentQuestion].answer[i] === clickedLetter){
            document.querySelector(`.letterSpace${i}`).innerHTML = clickedLetter;
            event.currentTarget.style.backgroundColor = "green";
            bWrong = false;
            nCorrectAns++
        }
    }
    if(bWrong) {
        nWrongAns++;
        document.querySelector(`.tillhangHanger`).setAttribute("src", `../assets/images/tillhang/hanger${nWrongAns}.svg`);
    }
    if(nCorrectAns === arrTillhangQuestion[nTillhangCurrentQuestion].answer.length){
        //send to win
        tillhangQuestionFeedback(true);
    } else if(nWrongAns === LOOSE_QUESTION) {
        //send to loose
        tillhangQuestionFeedback(false);
    }
}

/* tillhangQuestionFeedback
--------------------------------------------------------------
Description: start tillhang app*/
const tillhangQuestionFeedback = (win) => {
    document.querySelector(`.tillhangkeyBoard`).classList.add(`hidden`);
    if(win) {
        nTillhangCorrectAnswers++;
        document.querySelector(`.tillhangTitleDefinition`).innerHTML = `אלופים!`;
        document.querySelector(`.tillhangDefinition`).innerHTML = `אנחנו תולים בכם תקוות גבוהות`;
    } else {
        document.querySelector(`.tillhangTitleDefinition`).innerHTML = `מזל שאנחנו לא תלויים בכך`;
        document.querySelector(`.tillhangDefinition`).innerHTML = `התשובה הנכונה :`;
        for(let i = 0; i < arrTillhangQuestion[nTillhangCurrentQuestion].answer.length; i++){
            if(arrTillhangQuestion[nTillhangCurrentQuestion].answer[i] !== "-"){
                document.querySelector(`.letterSpace${i}`).innerHTML = arrTillhangQuestion[nTillhangCurrentQuestion].answer[i];
            }
        }
    }
    let next;
    nTillhangCurrentQuestion++;
    if(nTillhangCurrentQuestion < AMOUNT_OF_TILLHANG_QUESTION){
        next = El("img", {cls: `tillHangNextQuestion`, attributes: {src: `../assets/images/tillhang/leftArrow.svg`}, listeners: {click: createHangman}})
    } else {
        next = El("img", {cls: `tillHangNextQuestion`, attributes: {src: `../assets/images/tillhang/leftArrow.svg`}, listeners: {click: tillhangEnd}})
    }
    document.querySelector(`.tillhang`).append(next);
}

/* tillhangEnd
--------------------------------------------------------------
Description: start tillhang app*/
const tillhangEnd = () => {
    document.querySelector(`.tillhang`).innerHTML = "";
    let content;
    if(nTillhangCorrectAnswers/AMOUNT_OF_TILLHANG_QUESTION >= PASSING_RATE) {
        content = El("div", {classes: [`tillhangContainer`, `flexCenter`]},
            El("div",{cls: `tillhangTitleDefinition`}, `כל הכבוד הצלחתם להציל את האיש מתלייה!`),
            El("div",{cls: `tillhangDefinition`}, `ניחשתם נכון ${nTillhangCorrectAnswers} מושגים מתוך ${AMOUNT_OF_TILLHANG_QUESTION}`),
            El("img",{classes: [`tillhangEndMan`], attributes: {src: `../assets/images/tillhang/man.png`}}),
            // El("div",{cls: `tillhangEndButton`, listeners: {click: sendHome}},`נמחקתי`),
        );
    } else {
        content = El("div", {classes: [`tillhangContainer`, `flexCenter`]},
            El("div",{cls: `tillhangTitleDefinition`}, `האיש נתלה! פשוט אי אפשר לסמוך עליכם`),
            El("div",{cls: `tillhangDefinition`}, `ניחשתם נכון ${nTillhangCorrectAnswers} מושגים מתוך ${AMOUNT_OF_TILLHANG_QUESTION}`),
            El("img",{classes: [`tillhangEndMan`], attributes: {src: `../assets/images/tillhang/man.png`}}),
            // El("div",{cls: `tillhangEndButton`, listeners: {click: sendHome}},`נמחקתי`),

        );
    }
    document.querySelector(`.tillhang`).append(content);
}

/*
shuffle
------------------------------------------------
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal
------------------------------------------------
*/
function shuffle(arr) {
    let tmp = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

/* El
--------------------------------------------------------------
Description: create html elements */
function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}

