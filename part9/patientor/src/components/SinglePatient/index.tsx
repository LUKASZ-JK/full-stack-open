import { Typography, Box, Button, Alert } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import { NewEntry, Patient } from '../../types';
import SingleEntry from '../SingleEntry';
import useToggle from '../../hooks/useToggle';
import EntryForm from './EntryForm';
import entriesService from '../../services/entries';
import { useState } from 'react';
import axios from 'axios';

const SinglePatient = ({ patient }: { patient: Patient }) => {
  const [toggle, setToggle] = useToggle();
  const [notification, setNotification] = useState('');
  const [currentPatient, setCurrentPatient] = useState(patient);

  const genderIcon =
    currentPatient.gender === 'male' ? <MaleIcon /> : currentPatient.gender === 'female' ? <FemaleIcon /> : null;

  const displayNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const addEntry = async (values: NewEntry) => {
    try {
      const entry = await entriesService.create(currentPatient.id, values);
      setToggle();
      setCurrentPatient(curr => ({ ...curr, entries: curr.entries.concat(entry) }));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          displayNotification(message);
        } else {
          displayNotification('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        displayNotification('Unknown error');
      }
    }
  };

  return (
    <Box mt={4}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" component="h2" sx={{ mr: '1rem' }}>
          {currentPatient.name}
        </Typography>
        {genderIcon}
      </Box>
      <Typography>ssn: {currentPatient.ssn}</Typography>
      <Typography>occupation: {currentPatient.occupation}</Typography>
      <Typography variant="h5" component="h2" sx={{ mt: '1rem' }}>
        entries
      </Typography>
      <Button variant="contained" color="primary" onClick={setToggle} sx={{ mb: 2 }}>
        Add entry
      </Button>
      {notification && (
        <Alert variant="filled" severity="error">
          {notification}
        </Alert>
      )}
      {toggle && <EntryForm setToggle={setToggle} addEntry={addEntry} />}
      {currentPatient.entries.map(entry => (
        <SingleEntry key={entry.id} entry={entry} />
      ))}
    </Box>
  );
};

export default SinglePatient;
