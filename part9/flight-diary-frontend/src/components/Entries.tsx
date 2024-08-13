import { DiaryEntry } from '../types';

const Entries = ({ entries }: { entries: DiaryEntry[] }) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {entries.map(entry => (
        <div key={entry.id}>
          <h3>{entry.date}</h3>
          <p>visibility: {entry.visibility}</p>
          <p>weather: {entry.weather}</p>
        </div>
      ))}
    </div>
  );
};

export default Entries;
