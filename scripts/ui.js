import { getState, updateState } from './state.js';
import { compileRegex, highlight } from './search.js';
import { validateField } from './validators.js';
import { validateJSONStructure } from './storage.js';

const formatDuration = (minutes) => {
  const total = Number(minutes) || 0;
  const hours = Math.floor(total / 60);
  const mins = Math.round(total % 60);

  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
};

const getLastSevenDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: date.toISOString().slice(0, 10)
    });
  }
  return days;
};

export function renderApp() {
  renderStats();
  renderTable();
  const converter = document.getElementById('minutes-conversion');
  if (converter) {
    const minutes = Number(converter.value) || 0;
    document.getElementById('hours-output').textContent = `${(minutes / 60).toFixed(2)}h`;
  }
}

export function renderStats() {
  const { records, targetMinutes } = getState();
  const count = records.length;
  const totalMinutes = records.reduce((acc, record) => acc + (Number(record.duration) || 0), 0);

  const tags = records.reduce((acc, record) => {
    const tag = record.tag || 'Unassigned';
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const topTag = Object.keys(tags).reduce((top, current) => {
    if (!top) return current;
    return tags[current] > tags[top] ? current : top;
  }, '');

  document.getElementById('stat-count').textContent = count;
  document.getElementById('stat-total').textContent = formatDuration(totalMinutes);
  document.getElementById('stat-top-tag').textContent = topTag || '-';

  const chart = document.getElementById('trend-chart');
  if (chart) {
    const days = getLastSevenDays();
    const maxValue = Math.max(1, ...days.map(day => {
      const date = day.value;
      return records
        .filter(record => record.dueDate === date)
        .reduce((sum, record) => sum + (Number(record.duration) || 0), 0);
    }));

    chart.innerHTML = days.map((day) => {
      const total = records
        .filter(record => record.dueDate === day.value)
        .reduce((sum, record) => sum + (Number(record.duration) || 0), 0);
      const height = Math.max(12, (total / maxValue) * 100);
      return `
        <div class="trend-bar" title="${day.label}: ${total} minutes">
          <span class="trend-fill" style="height:${height}%"></span>
          <span class="trend-label">${day.label}</span>
        </div>
      `;
    }).join('');
  }

  const capMsg = document.getElementById('cap-status-msg');
  if (capMsg) {
    const remaining = targetMinutes - totalMinutes;
    if (totalMinutes > targetMinutes) {
      capMsg.textContent = `Target exceeded by ${formatDuration(Math.abs(remaining))}.`;
      capMsg.style.color = '#b91c1c';
      capMsg.style.background = '#fee2e2';
      capMsg.setAttribute('aria-live', 'assertive');
    } else {
      capMsg.textContent = `${formatDuration(remaining)} left before your weekly target of ${formatDuration(targetMinutes)}.`;
      capMsg.style.color = '#166534';
      capMsg.style.background = '#dcfce7';
      capMsg.setAttribute('aria-live', 'polite');
    }
  }
}

export function renderTable() {
  const { records, filter, caseSensitive, sort } = getState();
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  const flags = caseSensitive ? 'g' : 'gi';
  const re = compileRegex(filter, flags);

  const filteredRecords = records.filter((record) => {
    if (!re) return true;
    const haystack = [record.title, record.tag, record.dueDate, String(record.duration)].join(' ');
    return re.test(haystack);
  });

  filteredRecords.sort((a, b) => {
    if (sort === 'due-desc') return new Date(b.dueDate) - new Date(a.dueDate);
    if (sort === 'due-asc') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sort === 'title-az') return a.title.localeCompare(b.title);
    if (sort === 'duration-desc') return Number(b.duration) - Number(a.duration);
    if (sort === 'duration-asc') return Number(a.duration) - Number(b.duration);
    return 0;
  });

  if (filteredRecords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No matching tasks found.</td></tr>';
    return;
  }

  filteredRecords.forEach((record) => {
    const row = document.createElement('tr');
    const highlightedTitle = highlight(record.title, re);
    const highlightedTag = highlight(record.tag, re);

    row.innerHTML = `
      <td><strong>${highlightedTitle}</strong></td>
      <td>${formatDuration(record.duration)}</td>
      <td><span class="badge">${highlightedTag}</span></td>
      <td>${record.dueDate}</td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-secondary table-button" data-action="edit" data-id="${record.id}">Edit</button>
          <button type="button" class="btn-secondary table-button danger" data-action="delete" data-id="${record.id}">Delete</button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

export function initEventListeners() {
  const taskDialog = document.getElementById('task-dialog');
  const taskForm = document.getElementById('task-form');

  const resetTaskForm = () => {
    taskForm.reset();
    document.getElementById('record-id').value = '';
    document.getElementById('form-heading').textContent = 'Add a task';
    ['title-error', 'duration-error', 'tag-error', 'due-date-error'].forEach((id) => {
      document.getElementById(id).textContent = '';
    });
    updateState({ editingId: null });
  };

  const openTaskDialog = () => {
    resetTaskForm();
    taskDialog.showModal();
    document.getElementById('title-input').focus();
  };

  document.querySelectorAll('.nav-link[data-target]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelectorAll('.nav-link').forEach((navLink) => navLink.classList.remove('active'));
      document.querySelectorAll('.app-section').forEach((section) => section.classList.remove('active'));
      link.classList.add('active');
      const targetId = link.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add('active');
    });
  });

  document.querySelectorAll('[data-open-task-dialog]').forEach((button) => {
    button.addEventListener('click', openTaskDialog);
  });

  document.querySelectorAll('[data-close-task-dialog]').forEach((button) => {
    button.addEventListener('click', () => taskDialog.close());
  });

  taskDialog.addEventListener('close', resetTaskForm);

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      updateState({ filter: event.target.value });
      renderTable();
    });
  }

  const caseToggle = document.getElementById('case-sensitive-toggle');
  if (caseToggle) {
    caseToggle.addEventListener('change', (event) => {
      updateState({ caseSensitive: event.target.checked });
      renderTable();
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (event) => {
      updateState({ sort: event.target.value });
      renderTable();
    });
  }

  const targetInput = document.getElementById('target-minutes');
  if (targetInput) {
    targetInput.addEventListener('input', (event) => {
      const value = Number(event.target.value) || 0;
      updateState({ targetMinutes: value });
      renderStats();
    });
  }

  const converterInput = document.getElementById('minutes-conversion');
  if (converterInput) {
    converterInput.addEventListener('input', (event) => {
      const value = Number(event.target.value) || 0;
      document.getElementById('hours-output').textContent = `${(value / 60).toFixed(2)}h`;
    });
  }

  const form = taskForm;
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = document.getElementById('title-input').value.trim();
      const duration = Number(document.getElementById('duration-input').value);
      const tag = document.getElementById('tag-input').value.trim();
      const dueDate = document.getElementById('due-date-input').value;

      const titleError = validateField('title', title);
      const durationError = validateField('duration', String(duration));
      const tagError = validateField('tag', tag);
      const dueDateError = validateField('dueDate', dueDate);

      document.getElementById('title-error').textContent = titleError;
      document.getElementById('duration-error').textContent = durationError;
      document.getElementById('tag-error').textContent = tagError;
      document.getElementById('due-date-error').textContent = dueDateError;

      if (titleError && !titleError.includes('Warning')) return;
      if (durationError || tagError || dueDateError) return;

      const { records, editingId } = getState();
      const now = new Date().toISOString();

      if (editingId) {
        const updatedRecords = records.map((record) => record.id === editingId ? {
          ...record,
          title,
          duration,
          tag,
          dueDate,
          updatedAt: now
        } : record);
        updateState({ records: updatedRecords, editingId: null });
      } else {
        const newRecord = {
          id: `plan_${Date.now()}`,
          title,
          duration,
          tag,
          dueDate,
          createdAt: now,
          updatedAt: now
        };
        updateState({ records: [newRecord, ...records] });
      }

      form.reset();
      document.getElementById('record-id').value = '';
      document.getElementById('form-heading').textContent = 'Add a task';
      taskDialog.close();
      renderApp();
      document.querySelector('[data-target="records"]').click();
    });
  }

  document.getElementById('table-body').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');
    const { records } = getState();

    if (action === 'delete') {
      if (confirm('Delete this task?')) {
        updateState({ records: records.filter(record => record.id !== id) });
        renderApp();
      }
      return;
    }

    if (action === 'edit') {
      const record = records.find(item => item.id === id);
      if (!record) return;

      document.getElementById('record-id').value = record.id;
      document.getElementById('title-input').value = record.title;
      document.getElementById('duration-input').value = record.duration;
      document.getElementById('tag-input').value = record.tag;
      document.getElementById('due-date-input').value = record.dueDate;
      document.getElementById('form-heading').textContent = 'Edit task';
      updateState({ editingId: record.id });
      taskDialog.showModal();
      document.getElementById('title-input').focus();
    }
  });

  const exportButton = document.getElementById('export-btn');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      const { records } = getState();
      const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'campus-planner-export.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  const importInput = document.getElementById('import-file');
  if (importInput) {
    importInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = validateJSONStructure(loadEvent.target.result);
        if (!result.valid) {
          alert(`Import failed: ${result.error}`);
          return;
        }

        updateState({ records: result.data });
        renderApp();
        alert('Data imported and validated successfully.');
      };
      reader.readAsText(file);
    });
  }
}
