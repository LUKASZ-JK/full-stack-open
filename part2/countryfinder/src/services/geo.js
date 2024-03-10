import axios from 'axios'
const baseUrl = 'http://api.openweathermap.org/geo/1.0'

const getLocation = (cityName,countryCode,APIkey) => {
  const request = axios.get(`${baseUrl}/direct?q=${cityName},${countryCode}&limit=1&appid=${APIkey}`)
  return request.then(response => response.data)
}
export default { getLocation }

