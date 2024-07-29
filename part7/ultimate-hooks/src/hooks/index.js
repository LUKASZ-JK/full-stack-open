import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = baseUrl => {
  const [resources, setResources] = useState([])

  const hook = () => {
    const request = axios.get(baseUrl)
    request.then(response => setResources(response.data)).catch(error => console.log(error))
  }

  useEffect(hook, [baseUrl])

  const create = resource => {
    const request = axios.post(baseUrl, resource)
    request
      .then(response => setResources(resources => [...resources, response.data]))
      .catch(error => console.log(error))
  }

  const service = {
    create
  }

  return [resources, service]
}
