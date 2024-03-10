import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5'

const getWeather = (lat,lon,APIkey) => {
  const request = axios.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`)
  return request.then(response => response.data)
}
export default { getWeather }

