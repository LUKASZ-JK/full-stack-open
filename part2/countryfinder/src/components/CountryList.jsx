import { CountryName } from './CountryName';

export const CountryList = ({ countries, handler }) => {
  if (countries !== null) {
    if (countries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      );
    }
    if (countries.length === 1) {
      return null;
    }
    return (
      <div>
        {countries.map(
          country => <CountryName
            key={country.name.common}
            name={country.name.common}
            handler={() => handler(country)} />
        )}
      </div>
    );
  }

  return null;
};
