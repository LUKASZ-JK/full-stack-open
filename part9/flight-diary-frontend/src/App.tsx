import { useState, useEffect } from 'react';

import { DiaryEntry, NewDiaryEntry } from './types';
import DiaryService from './services/entries.ts';
import Entries from './components/Entries.tsx';
import EntryForm from './components/EntryForm.tsx';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    DiaryService.getAll().then(data => {
      setEntries(data);
    });
  }, []);

  const addEntry = (newEntry: NewDiaryEntry) => {
    DiaryService.createEntry(newEntry)
      .then(data => {
        if (data !== undefined) {
          setEntries([...entries, data]);
        }
      })
      .catch(error => {
        setNotification(error.message);
      });
  };

  return (
    <>
      <div>
        <EntryForm addEntry={addEntry} notification={notification} />
        <Entries entries={entries} />
      </div>
    </>
  );
}

export default App;
