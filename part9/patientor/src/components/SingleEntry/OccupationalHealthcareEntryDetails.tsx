import { useContext } from 'react';
import { DiagnosesContext } from '../../App';
import { Diagnosis, OccupationalHealthcareEntry } from '../../types';
import { Typography, Box } from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  const diagnoses = useContext(DiagnosesContext);

  return (
    <Box sx={{ border: 'solid 1px #000000', borderRadius: '10px', padding: '1rem', mb: '1rem' }}>
      <Box display="flex" alignItems="center">
        <Typography sx={{ mr: '0.5rem' }}>{entry.date}</Typography>
        <MedicalInformationIcon />
        <Typography sx={{ ml: '0.5rem' }}>{entry.employerName}</Typography>
      </Box>
      <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
      {entry.sickLeave && (
        <Typography>
          Sick leave from {entry.sickLeave.startDate} till {entry.sickLeave.endDate}
        </Typography>
      )}
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes?.map(code => {
            const diagnose: Diagnosis | undefined = diagnoses.find(diagnose => diagnose.code === code);
            return (
              <li key={code}>
                <Typography>{`${code} ${diagnose ? diagnose.name : ''}`}</Typography>
              </li>
            );
          })}
        </ul>
      )}
      {entry.specialist && <Typography>Diagnose by: {entry.specialist}</Typography>}
    </Box>
  );
};

export default OccupationalHealthcareEntryDetails;
