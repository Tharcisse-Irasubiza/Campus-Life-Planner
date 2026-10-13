import { loadRecords, saveRecords } from './storage.js';

const defaultRecords = [
  { id: 'plan_101', title: 'Biology revision quiz', dueDate: '2026-10-14', duration: 75, tag: 'Academics', createdAt: '2026-10-01T08:00:00.000Z', updatedAt: '2026-10-01T08:00:00.000Z' },
  { id: 'plan_102', title: 'Design studio critique', dueDate: '2026-10-15', duration: 90, tag: 'Events', createdAt: '2026-10-02T09:00:00.000Z', updatedAt: '2026-10-02T09:00:00.000Z' },
  { id: 'plan_103', title: 'Chemistry lab report', dueDate: '2026-10-16', duration: 120, tag: 'Academics', createdAt: '2026-10-03T10:00:00.000Z', updatedAt: '2026-10-03T10:00:00.000Z' },
  { id: 'plan_104', title: 'Campus wellness walk', dueDate: '2026-10-14', duration: 45, tag: 'Wellness', createdAt: '2026-10-04T07:30:00.000Z', updatedAt: '2026-10-04T07:30:00.000Z' },
  { id: 'plan_105', title: 'Volunteer orientation', dueDate: '2026-10-18', duration: 60, tag: 'Volunteering', createdAt: '2026-10-05T12:00:00.000Z', updatedAt: '2026-10-05T12:00:00.000Z' },
  { id: 'plan_106', title: 'Career fair prep', dueDate: '2026-10-17', duration: 80, tag: 'Career', createdAt: '2026-10-06T14:00:00.000Z', updatedAt: '2026-10-06T14:00:00.000Z' },
  { id: 'plan_107', title: 'Study group meeting', dueDate: '2026-10-13', duration: 110, tag: 'Study Group', createdAt: '2026-10-07T16:45:00.000Z', updatedAt: '2026-10-07T16:45:00.000Z' },
  { id: 'plan_108', title: 'Math tutorial review', dueDate: '2026-10-19', duration: 65, tag: 'Academics', createdAt: '2026-10-08T08:20:00.000Z', updatedAt: '2026-10-08T08:20:00.000Z' },
  { id: 'plan_109', title: 'Library research sprint', dueDate: '2026-10-20', duration: 150, tag: 'Academics', createdAt: '2026-10-09T09:15:00.000Z', updatedAt: '2026-10-09T09:15:00.000Z' },
  { id: 'plan_110', title: 'Student council briefing', dueDate: '2026-10-12', duration: 50, tag: 'Events', createdAt: '2026-10-10T10:00:00.000Z', updatedAt: '2026-10-10T10:00:00.000Z' }
];

const savedRecords = loadRecords();

let state = {
  records: savedRecords.length ? savedRecords : defaultRecords,
  filter: '',
  caseSensitive: false,
  sort: 'due-desc',
  targetMinutes: 240,
  editingId: null
};

export function getState() {
  return state;
}

export function updateState(updates) {
  state = { ...state, ...updates };
  if (updates.records) {
    saveRecords(state.records);
  }
}
