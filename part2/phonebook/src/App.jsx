import './index.css'
import { useState, useEffect } from 'react'
import personService from './services/persons'
import { Persons } from './components/Persons'
import { PersonForm } from './components/PersonForm'
import { Filter } from './components/Filter'
import { Notification } from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const hook = () => {
    personService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
      })
      .catch(error => console.alert(error))

  }

  useEffect(hook, [])

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter))
  const addName = (e) => {
    e.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        setNotification({
          message: `${existingPerson.name} number is already ${newNumber}`,
          type: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
      else {
        if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
          const changedPerson = { ...existingPerson, number: newNumber }
          personService.update(existingPerson.id, changedPerson)
            .then(response => {
              setPersons(persons.map(person => person.id !== existingPerson.id ? person : response))
              setNotification({
                message: `Changed ${existingPerson.name} number from ${existingPerson.number} to ${newNumber}`,
                type: 'success'
              })
              setTimeout(() => {
                setNotification(null)
              }, 3000)
            })
            .catch(error => {
              setNotification({
                message: `Failed to change the number`,
                type: 'error'
              })
              setTimeout(() => {
                setNotification(null)
              }, 3000)
            })
        }
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber }
      personService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setNotification({
            message: `Added ${newName}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          setNotification({
            message: `Failed to add new person`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
    }
  }

  const removeName = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== response.id))
          setNotification({
            message: `Removed ${person.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
        })
        .catch(error => {
          setNotification({
            message: `Information of ${person.name} has already been removed from server`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== person.id))
        })

    }
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  const handleNameRemoval = (person) => {
    removeName(person)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter
        filter={filter}
        onFilterChangeHandler={handleFilterChange}
      />
      <h3>Add a new</h3>
      <PersonForm
        onSubmitHandler={addName}
        newName={newName}
        newNumber={newNumber}
        onNameChangeHandler={handleNameChange}
        onNumberChangeHandler={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons
        persons={personsToShow}
        onRemoveHandler={handleNameRemoval} />
    </div>
  )
}

export default App