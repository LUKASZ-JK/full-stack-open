import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Link, Routes, useMatch } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Patient } from './types';

import patientService from './services/patients';
import PatientListPage from './components/PatientListPage';
import SinglePatient from './components/SinglePatient';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient>();

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  const matchPatient = useMatch('/api/patients/:id');

  useEffect(() => {
    setPatient(undefined);
    const fetchSinglePatient = async (id: string) => {
      const patient = await patientService.getSingle(id);
      setPatient(patient);
    };
    if (matchPatient?.params.id) {
      void fetchSinglePatient(matchPatient.params.id);
    }
  }, [matchPatient]);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
          <Route path="/api/patients/:id" element={patient ? <SinglePatient patient={patient} /> : null} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
