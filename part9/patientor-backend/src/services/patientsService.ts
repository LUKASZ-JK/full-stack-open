import patientsData from '../../data/patients-full';

import { Patient, NonSensitivePatient, NewPatient, Entry, NewEntry } from '../types';

import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientsData;

const getAll = (): Patient[] => {
  return patients;
};

const getAllNoSensitiveInfo = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getSingleInfo = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, entry: NewEntry): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAll,
  getAllNoSensitiveInfo,
  getSingleInfo,
  addPatient,
  addEntry,
};
