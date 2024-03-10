export const CountryForm = (props) => {
  return (
    <div>
      find countries<input value={props.filter} onChange={props.onFilterChangeHandler} />
    </div>
  );
};
