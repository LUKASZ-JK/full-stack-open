import diagnosesData from '../../data/diagnoses';

import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnosesData;

const getAll = (): Diagnosis[] => {
  return diagnoses;
};

export default {
  getAll,
};
