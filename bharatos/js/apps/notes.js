// Notes App
function initNotes() {
  const area = document.getElementById('notes-textarea');
  if (!area) return;
  
  const saved = localStorage.getItem('bharatos_notes');
  if (saved) area.value = saved;
  updateNotesCount();
  
  area.addEventListener('input', () => {
    localStorage.setItem('bharatos_notes', area.value);
    updateNotesCount();
  });
}

function updateNotesCount() {
  const area = document.getElementById('notes-textarea');
  const countEl = document.getElementById('notes-count');
  if (!area || !countEl) return;
  
  const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
  countEl.textContent = words + ' words, ' + area.value.length + ' chars';
}

function newNote() {
  const area = document.getElementById('notes-textarea');
  if (area) {
    area.value = '';
    localStorage.setItem('bharatos_notes', '');
    updateNotesCount();
  }
}
