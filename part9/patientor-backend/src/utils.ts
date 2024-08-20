import {
  NewPatient,
  Gender,
  Diagnosis,
  NewEntry,
  EntryType,
  NewBaseEntry,
  Discharge,
  SickLeave,
  HealthCheckRating,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect ssn: ' + ssn);
  }
  return ssn;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect date: ' + date);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }
  return gender;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: [],
    };

    return newPatient;
  }

  throw new Error('Incorrect data: a field missing');
};

const parseType = (type: unknown): EntryType => {
  if (!isString(type)) {
    throw new Error('Incorrect or missing type');
  }
  if (type === 'Hospital' || type === 'OccupationalHealthcare' || type === 'HealthCheck') {
    return type;
  } else {
    throw new Error('Unsupported entry type');
  }
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseDischarge = (object: unknown): Discharge => {
  if (
    !object ||
    typeof object !== 'object' ||
    !('discharge' in object) ||
    !object.discharge ||
    typeof object.discharge !== 'object'
  ) {
    throw new Error('Incorrect or missing discharge info');
  }
  if (
    !('criteria' in object.discharge) ||
    !isString(object.discharge.criteria) ||
    !('date' in object.discharge) ||
    !isString(object.discharge.date) ||
    !isDate(object.discharge.date)
  ) {
    throw new Error('Incorrect or missing discharge date or criteria');
  }

  return object.discharge as Discharge;
};

const parseEmployerName = (object: unknown): string => {
  if (!object || typeof object !== 'object' || !('employerName' in object) || !isString(object.employerName)) {
    throw new Error('Incorrect or missing employer name');
  }
  return object.employerName;
};

const parseSickLeave = (object: unknown): SickLeave | undefined => {
  if (
    !object ||
    typeof object !== 'object' ||
    !('sickLeave' in object) ||
    !object.sickLeave ||
    typeof object.sickLeave !== 'object'
  ) {
    return undefined;
  }
  if (
    !('startDate' in object.sickLeave) ||
    !isString(object.sickLeave.startDate) ||
    !isDate(object.sickLeave.startDate) ||
    !('endDate' in object.sickLeave) ||
    !isString(object.sickLeave.endDate) ||
    !isDate(object.sickLeave.endDate)
  ) {
    throw new Error('Incorrect or missing sick leave date');
  }

  return object.sickLeave as SickLeave;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map(v => Number(v))
    .includes(param);
};

const parseHealthCheckRating = (object: unknown): HealthCheckRating => {
  if (!object || typeof object !== 'object' || !('healthCheckRating' in object)) {
    throw new Error('Incorrect or missing health check rating');
  }
  if (isNaN(Number(object.healthCheckRating)) || !isHealthCheckRating(Number(object.healthCheckRating))) {
    throw new Error('Incorrect health check rating: ' + object.healthCheckRating);
  }
  return Number(object.healthCheckRating);
};

const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('description' in object && 'date' in object && 'specialist' in object && 'type' in object) {
    const type = parseType(object.type);
    const newBaseEntry: NewBaseEntry = {
      description: parseDescription(object.description),
      date: parseDate(object.date),
      specialist: parseSpecialist(object.specialist),
      diagnosisCodes: parseDiagnosisCodes(object),
    };
    let newEntry: NewEntry;
    switch (type) {
      case 'Hospital':
        newEntry = { ...newBaseEntry, type, discharge: parseDischarge(object) };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          ...newBaseEntry,
          type,
          employerName: parseEmployerName(object),
          sickLeave: parseSickLeave(object),
        };
        break;
      case 'HealthCheck':
        newEntry = { ...newBaseEntry, type, healthCheckRating: parseHealthCheckRating(object) };
        break;
      default:
        return assertNever(type);
    }
    return newEntry;
  }
  throw new Error('Incorrect data: a field missing');
};

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export default { toNewPatient, toNewEntry };
