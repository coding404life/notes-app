// -----------------------------------------------------------------------------
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyDNBzlCfKvw3nGQKxi30-ExrNyfeZdrGsw",
    authDomain: "notes-app-b451b.firebaseapp.com",
    databaseURL: "https://notes-app-b451b.firebaseio.com",
    projectId: "notes-app-b451b",
    storageBucket: "notes-app-b451b.appspot.com",
    messagingSenderId: "618376851443",
    appId: "1:618376851443:web:42db583d2c680066132c86",
    measurementId: "G-5NH57ZLC84"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
// database init
// -----------------------------------------------------------------------------

// DOM Ref
const addBtn = document.querySelector('.add-note');
const cardsContainer = document.querySelector('.cards-container');
const fieldForm = document.querySelector('.card-form');
const cardBox = document.querySelector('.add-note-card');
const cardDisplay = document.querySelector('.display-card');
const notesContainer = document.querySelector('#notes-container');

//storing databse connection
const db = firebase.firestore();

// 1. get data from firebase
const getData = () => {
    // 1. clear the container everytime call this function to get fresh data from databse
    cardsContainer.innerHTML = ' '
    // 2. get the data collection from firebase
    db.collection('notes').get().then(snapshot => {
        // 3. loop through documents
        snapshot.docs.forEach((doc) => {
            // 4. save the title notes doc into variables
            let title = doc.data().title;
            let note = doc.data().note;
            let atTime = doc.data().atTime;
            // 5. display card function
            const cards = displayCards(title, note, atTime);
            // 6. output the cards into the inner face
            cardsContainer.innerHTML += cards
        });
    }).catch(err => {
        console.log(err);
    });
}
// 2. call the getDate fun at the start to get data
getData();

// 3. output the data from databse into our app
const displayCards = (cardTitle, cardText, fullDate) => {
    // html that inserted into the page
    const cards = `
    <div class="card">
         <div class="card-body">
             <h5 class="card-title" contenteditable placeholder="title...">${cardTitle}</h5>
             <p contenteditable placeholder="write some notes..." class="card-text">${cardText}</p>
             <p class="card-text"><small class="text-muted">${fullDate}</small></p>
        </div>
    </div>`;
    // 4. insert cards at the end 
    return cards;
    // cardsContainer.insertAdjacentHTML('beforeend', cards);

}

// 4. display the note box if click on add note button
cardDisplay.addEventListener('click', () => {
    cardBox.classList.toggle('d-none');
});

// 5. create a time function
const timeFun = () => {
    const nowDate = new Date();
    const y = nowDate.getFullYear();
    const m = nowDate.getMonth();
    const d = nowDate.getDay();
    const hour = nowDate.getHours();
    const pmOrAm = hour >= 12 ? ' PM' : ' AM';
    const mint = nowDate.getMinutes();
    const fullDate = `${y}-${m}-${d} at ${hour % 12}:${mint} ${pmOrAm}`;

    return fullDate;
}

// 6. on click save data into firebase
addBtn.addEventListener('click', () => {
    // input fields data 
    const cardTitleValue = fieldForm.title.value.trim();
    const cardTextValue = fieldForm.text.value.trim();

    // only add note if at least have title
    if (cardTitleValue.length || cardTextValue.length) {
        // 3. add document into firebase
        db.collection('notes').add({
            title: cardTitleValue,
            note: cardTextValue,
            atTime: timeFun()
        }).then(docRef => {
            console.log(docRef);
        }).catch(err => {
            console.log(err);
        });

        // get the data from input fields and output data again
        getData();

        // 6. hide card box 
        cardBox.classList.add('d-none');
        // 7. clear fields
        fieldForm.reset()
    } else {
        alert('empty')
    }
});