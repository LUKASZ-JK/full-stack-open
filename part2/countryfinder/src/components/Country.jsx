import { Languages } from './Languages';

export const Country = ({ country }) => {

  if (country === null) {
    return null;
  }
  else {
    const flagStyle = {
      maxWidth: "200px",
      height: "auto"
    };
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <Languages languages={country.languages} />
        <img style={flagStyle} src={country.flags.svg} />
      </div>
    );
  }
};
