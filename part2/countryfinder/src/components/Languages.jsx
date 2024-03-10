import { Language } from './Language';

export const Languages = ({ languages }) => {
  return (
    <div>
      <h3>languages</h3>
      <ul>
        {Object.entries(languages).map(([key, value]) => (
          <Language key={key} lang={value} />
        ))}
      </ul>
    </div>
  );
};
