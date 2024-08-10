import patientsData from '../../data/patients';

import { Patient, PatientNoSensitiveInfo, NewPatient } from '../types';

import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData;

const getAll = (): Patient[] => {
  return patients;
};

const getAllNoSensitiveInfo = (): PatientNoSensitiveInfo[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getAll,
  getAllNoSensitiveInfo,
  addPatient,
};
