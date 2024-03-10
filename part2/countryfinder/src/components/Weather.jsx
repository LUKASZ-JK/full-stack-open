export const Weather = ({ weather }) => {
  if (weather === null) {
    return null;
  }
  if (weather === 'unavailable') {
    return (
      <h3>
        Weather unavailable
      </h3>);
  }
  return (
    <div>
      <h3>Weather in {weather.name}</h3>
      <p>temperature {weather.main.temp}°C</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}></img>
      <p>wind {weather.wind.speed}m/s</p>
    </div>
  );
};
