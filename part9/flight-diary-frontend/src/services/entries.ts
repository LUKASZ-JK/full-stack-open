import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = '/api/diaries';

const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(baseUrl);

  return data;
};

const createEntry = async (object: NewDiaryEntry) => {
  try {
    const { data } = await axios.post<DiaryEntry>(baseUrl, object);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data);
    } else {
      console.error(error);
    }
  }
};

export default {
  getAll,
  createEntry,
};
