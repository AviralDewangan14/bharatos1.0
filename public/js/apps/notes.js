// Notes / Text Editor with localStorage saving
function initNotes() {
  const textarea = document.getElementById('notes-textarea');
  if (!textarea) return;
  
  const saved = localStorage.getItem('bharatos_notes');
  if (saved) {
    textarea.value = saved;
  }
  updateWordCount();
  
  textarea.addEventListener('input', () => {
    localStorage.setItem('bharatos_notes', textarea.value);
    updateWordCount();
  });
}

function updateWordCount() {
  const textarea = document.getElementById('notes-textarea');
  const countEl = document.getElementById('notes-count');
  if (!textarea || !countEl) return;
  
  const text = textarea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  countEl.textContent = `${words} words, ${chars} chars`;
}

function newNote() {
  const textarea = document.getElementById('notes-textarea');
  if (textarea && confirm('Clear current note?')) {
    textarea.value = '';
    localStorage.removeItem('bharatos_notes');
    updateWordCount();
  }
}
