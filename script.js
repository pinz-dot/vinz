const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const imageInput = document.getElementById('imageInput');

function getNotes() {
  const notes = localStorage.getItem('cool-notes');
  return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes) {
  localStorage.setItem('cool-notes', JSON.stringify(notes));
}

function renderNotes() {
  const notes = getNotes();
  notesList.innerHTML = '';
  if (notes.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No notes yet, add one above!';
    emptyMsg.style.opacity = '0.7';
    emptyMsg.style.fontStyle = 'italic';
    emptyMsg.style.userSelect = 'none';
    notesList.appendChild(emptyMsg);
    return;
  }
  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.classList.add('note');

    if (note.type === 'text') {
      const textEl = document.createElement('div');
      textEl.classList.add('note-content');
      textEl.textContent = note.content;
      noteEl.appendChild(textEl);
    } else if (note.type === 'image') {
      const imageEl = document.createElement('img');
      imageEl.src = note.content;
      imageEl.alt = 'User  uploaded note image';
      noteEl.appendChild(imageEl);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete note';
    deleteBtn.onclick = () => {
      deleteNote(index);
    };
    noteEl.appendChild(deleteBtn);

    notesList.appendChild(noteEl);
  });
}

function addNote() {
  const text = noteInput.value.trim();
  if (text.length === 0) {
    alert('Please enter some text to add a note!');
    return;
  }
  const notes = getNotes();
  notes.unshift({ type: 'text', content: text });
  saveNotes(notes);
  noteInput.value = '';
  renderNotes();
  noteInput.focus();
}

function deleteNote(index) {
  let notes = getNotes();
  notes.splice(index, 1);
  saveNotes(notes);
  renderNotes();
}

addNoteBtn.addEventListener('click', addNote);

imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Selected file is not an image.');
    imageInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (evt) {
    const imageDataUrl = evt.target.result;
    const notes = getNotes();
    notes.unshift({ type: 'image', content: imageDataUrl });
    saveNotes(notes);
    renderNotes();
  };
  reader.readAsDataURL(file);
  imageInput.value = '';
});

noteInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    addNote();
  }
});

// Initial render
renderNotes();

const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Open detail modal with note content
function openNoteDetail(note) {
  modalBody.innerHTML = ''; // Clear previous content
  if(note.type === 'text') {
    const textDiv = document.createElement('div');
    textDiv.className = 'modal-text';
    textDiv.textContent = note.content;
    modalBody.appendChild(textDiv);
  } else if(note.type === 'image') {
    const imageEl = document.createElement('img');
    imageEl.src = note.content;
    imageEl.alt = 'Note image';
    modalBody.appendChild(imageEl);
  }
  modalOverlay.classList.remove('hidden');
}

// Close modal
function closeModal() {
  modalOverlay.classList.add('hidden');
  modalBody.innerHTML = '';
}

// Modify renderNotes to add click event for opening detail modal
function renderNotes() {
  const notes = getNotes();
  notesList.innerHTML = '';
  if (notes.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'No notes yet, add one above!';
    emptyMsg.style.opacity = '0.7';
    emptyMsg.style.fontStyle = 'italic';
    emptyMsg.style.userSelect = 'none';
    notesList.appendChild(emptyMsg);
    return;
  }
  notes.forEach((note, index) => {
    const noteEl = document.createElement('div');
    noteEl.classList.add('note');

    if (note.type === 'text') {
      const textEl = document.createElement('div');
      textEl.classList.add('note-content');
      textEl.textContent = note.content;
      noteEl.appendChild(textEl);
    } else if (note.type === 'image') {
      const imageEl = document.createElement('img');
      imageEl.src = note.content;
      imageEl.alt = 'User uploaded note image';
      noteEl.appendChild(imageEl);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '×';
    deleteBtn.title = 'Delete note';
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent opening detail modal
      deleteNote(index);
    };
    noteEl.appendChild(deleteBtn);

    // Clicking the note opens detail modal
    noteEl.onclick = () => {
      openNoteDetail(note);
    };

    notesList.appendChild(noteEl);
  });
}

// Close modal on close button or clicking outside modal content
modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Close modal on pressing Escape key
document.addEventListener('keydown', (e) => {
  if (!modalOverlay.classList.contains('hidden') && e.key === 'Escape') {
    closeModal();
  }
});
