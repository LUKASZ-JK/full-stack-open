import axios from 'axios';
import { DiaryEntry } from '../types';

const baseUrl = '/api/diaries';

const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(baseUrl);

  return data;
};

// const create = async (object: PatientFormValues) => {
//   const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

//   return data;
// };

export default {
  getAll,
  //create,
};
