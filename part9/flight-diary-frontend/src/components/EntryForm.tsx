import { useState } from 'react';
import { NewDiaryEntry, Visibility, Weather } from '../types';

import './EntryForm.css';

interface FormProps {
  addEntry: (newEntry: NewDiaryEntry) => void;
  notification: string;
}

const EntryForm = ({ addEntry, notification }: FormProps) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState(Visibility.Great);
  const [weather, setWeather] = useState(Weather.Sunny);
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    addEntry({
      date,
      visibility,
      weather,
      comment,
    });
    setDate('');
    setVisibility(Visibility.Great);
    setWeather(Weather.Sunny);
    setComment('');
  };
  return (
    <div>
      <h2>Add new entry</h2>
      {notification && <p style={{ color: '#FF0000' }}>{notification}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="Date">Date</label>
        <input name="Date" type="date" value={date} onChange={event => setDate(event.target.value)} />
        <div>
          <p className="description">Visibility:</p>
          <label htmlFor="Great">Great</label>
          <input
            type="radio"
            id="Great"
            name="visibility"
            value={Visibility.Great}
            checked={visibility === Visibility.Great}
            onChange={() => setVisibility(Visibility.Great)}
          />
          <label htmlFor="Good">Good</label>
          <input
            type="radio"
            id="Good"
            name="visibility"
            value={Visibility.Good}
            checked={visibility === Visibility.Good}
            onChange={() => setVisibility(Visibility.Good)}
          />
          <label htmlFor="Ok">Ok</label>
          <input
            type="radio"
            id="Ok"
            name="visibility"
            value={Visibility.Ok}
            checked={visibility === Visibility.Ok}
            onChange={() => setVisibility(Visibility.Ok)}
          />
          <label htmlFor="Poor">Poor</label>
          <input
            type="radio"
            id="Poor"
            name="visibility"
            value={Visibility.Poor}
            checked={visibility === Visibility.Poor}
            onChange={() => setVisibility(Visibility.Poor)}
          />
        </div>
        <div>
          <p className="description">Weather:</p>
          <label htmlFor="Sunny">Sunny</label>
          <input
            type="radio"
            id="Sunny"
            name="weather"
            value={Weather.Sunny}
            checked={weather === Weather.Sunny}
            onChange={() => setWeather(Weather.Sunny)}
          />
          <label htmlFor="Rainy">Rainy</label>
          <input
            type="radio"
            id="Rainy"
            name="weather"
            value={Weather.Rainy}
            checked={weather === Weather.Rainy}
            onChange={() => setWeather(Weather.Rainy)}
          />
          <label htmlFor="Cloudy">Cloudy</label>
          <input
            type="radio"
            id="Cloudy"
            name="weather"
            value={Weather.Cloudy}
            checked={weather === Weather.Cloudy}
            onChange={() => setWeather(Weather.Cloudy)}
          />
          <label htmlFor="Stormy">Stormy</label>
          <input
            type="radio"
            id="Stormy"
            name="weather"
            value={Weather.Stormy}
            checked={weather === Weather.Stormy}
            onChange={() => setWeather(Weather.Stormy)}
          />
          <label htmlFor="Windy">Windy</label>
          <input
            type="radio"
            id="Windy"
            name="weather"
            value={Weather.Windy}
            checked={weather === Weather.Windy}
            onChange={() => setWeather(Weather.Windy)}
          />
        </div>
        <label htmlFor="Comment">Comment</label>
        <input name="Comment" type="text" value={comment} onChange={event => setComment(event.target.value)} />
        <br />
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default EntryForm;
