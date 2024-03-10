export const Person = ({ person, onRemove }) => {
  return (
    <p>
      {person.name} {person.number} <button onClick={() => onRemove(person)}>delete</button>
    </p>
  );
};
