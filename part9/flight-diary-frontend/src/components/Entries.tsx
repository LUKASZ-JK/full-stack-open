import { DiaryEntry } from '../types';

const Entries = ({ entries }: { entries: DiaryEntry[] }) => {
  return entries.map(entry => (
    <div key={entry.id}>
      <h3>{entry.date}</h3>
      <p>visibility: {entry.visibility}</p>
      <p>weather: {entry.weather}</p>
    </div>
  ));
};

export default Entries;
