export const CountryName = ({ name, handler }) => {
  return (
    <p>
      {name}
      <button onClick={handler}>show</button>
    </p>
  );
};
