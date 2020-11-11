const addBtn = document.querySelector('.add-note');
const cardsContainer = document.querySelector('.cards-container');
const fieldForm = document.querySelector('.card-form');
const cardBox = document.querySelector('.add-note-card');
const cardDisplay = document.querySelector('.display-card');
const notesContainer = document.querySelector('#notes-container');


// 1. display the note box if click on add note button
cardDisplay.addEventListener('click', () => {
    cardBox.classList.toggle('d-none');
});

//  markup
const displayCards = (cardTitle, cardText) => {
    // html that inserted into the page
    const cards = `
    <div class="card">
         <div class="card-body">
             <h5 class="card-title" contenteditable placeholder="title...">${cardTitle}</h5>
             <p contenteditable placeholder="write some notes..." class="card-text">${cardText}</p>
             <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
    </div>`;

    cardsContainer.insertAdjacentHTML('beforeend', cards);
}

addBtn.addEventListener('click', () => {
    // input fields data 
    const cardTitleValue = fieldForm.title.value.trim();
    const cardTextValue = fieldForm.text.value.trim();

    // only add note if at least have title
    if (cardTitleValue.value == 0 || cardTextValue.value == 0) {
        alert('empty')
    } else {
        // 1. display card function
        displayCards(cardTitleValue, cardTextValue);
        // 2. hide card box 
        cardBox.classList.add('d-none');
        //3. clear fields
        fieldForm.reset()
    }
});
// 1. store data inside firebase

// 2. display a box so you type notes

// 3. take note data and save it into firebase on key down

// 4. display note data from firebase into your application

// 5.