import patientsData from '../../data/patients';

import { Patient, PatientNoSensitiveInfo } from '../types';

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

export default {
  getAll,
  getAllNoSensitiveInfo,
};
