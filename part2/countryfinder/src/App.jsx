import { useState, useEffect } from 'react'
import countryService from './services/country'
import geoService from './services/geo'
import weatherService from './services/weather'
import { CountryList } from './components/CountryList'
import { Country } from './components/Country'
import { CountryForm } from './components/CountryForm'
import { Weather } from './components/Weather'


const App = () => {
  const api_key = import.meta.env.VITE_WEATHER_KEY
  const [allCountries, setAllCountries] = useState(null);
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAllCountries()
      .then(response => { setAllCountries(response) })
      .catch(rejected => { console.error(rejected) })
  }, [])

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilter(newFilter);
    const visibleCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    setCountries(visibleCountries)
    if (visibleCountries.length === 1) {
      handleCountrySelection(visibleCountries[0])
    }
    else {
      handleCountrySelection(null)
      setWeather(null)
    }
  }

  const handleCountrySelection = (country) => {
    setSelectedCountry(country)
    if (country !== null) {
      geoService.getLocation(country.capital[0], country.cca2, api_key)
        .then(response => weatherService.getWeather(response[0].lat, response[0].lon, api_key))
        .then(response => setWeather(response))
        .catch(rejected => {
          setWeather('unavailable')
        })
    }
  }

  return (
    <div>
      <CountryForm
        filter={filter}
        onFilterChangeHandler={handleFilterChange} />
      <CountryList countries={countries} handler={handleCountrySelection} />
      <Country country={selectedCountry} />
      <Weather weather={weather} />
    </div>
  )
}

export default App