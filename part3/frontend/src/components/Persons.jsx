import { Person } from './Person';

export const Persons = ({ persons, onRemoveHandler }) => {
  return (
    <>
      {persons.map(
        person => <Person
          key={person.id}
          person={person}
          onRemove={onRemoveHandler} />
      )}
    </>
  );
};
