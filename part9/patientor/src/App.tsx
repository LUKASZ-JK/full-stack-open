import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Link, Routes, useMatch } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Patient, Diagnosis } from './types';

import patientService from './services/patients';
import diagnoseService from './services/diagnoses';
import PatientListPage from './components/PatientListPage';
import SinglePatient from './components/SinglePatient';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();

    const fetchDiagnosesList = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
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
          <Route
            path="/api/patients/:id"
            element={patient ? <SinglePatient patient={patient} diagnoses={diagnoses} /> : null}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
