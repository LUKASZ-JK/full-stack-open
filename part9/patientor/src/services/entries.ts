import axios from 'axios';
import { Entry, NewEntry, Patient } from '../types';

import { apiBaseUrl } from '../constants';

const create = async (id: Patient['id'], entry: NewEntry) => {
  const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, entry);

  return data;
};

export default {
  create,
};
