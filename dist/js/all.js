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

// 1. get data from firebase at the start
const getData = async () => {
    // 1. clear the container everytime call this function to get fresh data from databse
    cardsContainer.innerHTML = ' '
    // 2. get the data collection from firebase
    await db.collection('notes').get().then(snapshot => {
        // 3. loop through documents
        snapshot.docs.forEach((doc) => {
            // 4. save the title notes doc into variables
            let title = doc.data().title;
            let note = doc.data().note;
            let atTime = doc.data().atTime;
            // 5. display card function
            displayCards(title, note, atTime, doc.id);
            //gets the id
        });
    }).catch(err => {
        console.log(err);
    });
}
// 2. call the getDate fun at the start to get data
getData();

// 3. output the data from databse into our app
const displayCards = (cardTitle, cardText, fullDate, docID) => {
    // html that inserted into the page
    const cards = `
    <div class="card">
         <div class="card-body" id='${docID}'>
             <h5 class="card-title" contenteditable placeholder="title...">${cardTitle}</h5>
             <p contenteditable placeholder="write some notes..." class="card-text">${cardText}</p>
             <p class="card-text"><small class="text-muted"><i class="mr-3 far fa-trash-alt delete-note"></i>${fullDate}</small></p>
        </div>
    </div>`;
    // 4. insert cards at the end 
    cardsContainer.innerHTML += cards
}

// 4. display the note box if click on add note button
cardDisplay.addEventListener('click', () => {
    cardBox.classList.toggle('d-none');
});

// 5. create a time function
const timeFun = () => {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const nowDate = new Date();
    const y = nowDate.getFullYear();
    const m = nowDate.getMonth();
    const d = nowDate.getDate();
    const hour = nowDate.getHours();
    const pmOrAm = hour >= 12 ? ' PM' : ' AM';
    const mint = nowDate.getMinutes();
    const fullDate = `${month[m]}-${d}-${y} ${hour % 12}:${mint} ${pmOrAm}`;
    // return the date for all notes
    return fullDate;
}

// add new data into firebase
const addNewCard = async (docID) => {
    // 2. get the data collection from firebase
    await db.collection('notes').doc(`${docID}`).get().then(snapshot => {
        // 4. save the title notes doc into variables
        let title = snapshot.data().title;
        let note = snapshot.data().note;
        let atTime = snapshot.data().atTime;
        // 5. display card function
        displayCards(title, note, atTime, docID);
        //gets the id
    }).catch(err => {
        console.log(err);
    });
}

// 6. on click save data into firebase
addBtn.addEventListener('click', () => {
    // 1. get input fields data 
    const cardTitleValue = fieldForm.title.value.trim();
    const cardTextValue = fieldForm.text.value.trim();

    // only add note if at least have title
    if (cardTitleValue.length || cardTextValue.length) {
        // 1. add document into firebase
        db.collection('notes').add({
            title: cardTitleValue,
            note: cardTextValue,
            atTime: timeFun()
        }).then(docRef => {
            // 2. get the data from input fields and output data again
            addNewCard(docRef.id);
        }).catch(err => {
            console.log(err);
        });

        // 3. hide card box 
        cardBox.classList.add('d-none');
        // 4. clear fields
        fieldForm.reset()
    } else {
        alert('empty')
    }
});

// 7. set the new value function
const setNewValue = (titleValue, noteValue, cardId) => {
    db.collection('notes').doc(`${cardId}`).set({
        title: titleValue,
        note: noteValue,
        atTime: timeFun()
    }).then(() => {
        console.log('changed');
    }).catch(err => {
        console.log(err);
    });
}

// 8. change the text on keydown
cardsContainer.addEventListener('keyup', (e) => {
    // let titleValue, noteValue;

    // 1. target the element is being change e.target.parentNode and get the id
    const cardId = e.target.parentNode.id;

    // set the new card value if the target is 
    db.collection('notes').doc(`${cardId}`).get().then(snapshot => {
        // if the target class == to card title or card text get value and assign the new values into the card
        if (e.target.classList == 'card-title') {
            let titleValue = e.target.textContent;
            let noteValue = snapshot.data().note;
            setNewValue(titleValue, noteValue, cardId)
        } else if (e.target.classList == 'card-text') {
            let titleValue = snapshot.data().title;
            let noteValue = e.target.textContent;
            setNewValue(titleValue, noteValue, cardId)
        }
    }).catch(err => {
        console.log(err);
    });
});

// 9.delete note
cardsContainer.addEventListener('click', e => {
    // 1. get element contain a class of delete-note 

    if (e.target.classList.contains('delete-note')) {
        const deleteCardId = e.target.parentNode.parentNode.parentNode
        db.collection('notes').doc(`${deleteCardId.id}`).delete().then(() => {

            console.log("Document successfully deleted!");
        }).catch(err => {
            console.log(err);
        });
        deleteCardId.parentNode.remove();
    }

});