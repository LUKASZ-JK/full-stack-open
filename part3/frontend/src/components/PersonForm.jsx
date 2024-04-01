export const PersonForm = (props) => {

  return (
    <form onSubmit={props.onSubmitHandler}>
      <div>
        name: <input value={props.newName} onChange={props.onNameChangeHandler} required />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.onNumberChangeHandler} required />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};
