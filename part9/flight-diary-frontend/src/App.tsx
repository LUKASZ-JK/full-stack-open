import { useState, useEffect } from 'react';

import { DiaryEntry } from './types';
import DiaryService from './services/entries.ts';
import Entries from './components/Entries.tsx';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    DiaryService.getAll().then(data => {
      setEntries(data);
    });
  }, []);

  return (
    <>
      <div>
        <h2>Diary entries</h2>
        <Entries entries={entries} />
      </div>
    </>
  );
}

export default App;
