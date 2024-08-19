import { useContext } from 'react';
import { DiagnosesContext } from '../../App';
import { HospitalEntry, Diagnosis } from '../../types';
import { Typography, Box } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  const diagnoses = useContext(DiagnosesContext);

  return (
    <Box sx={{ border: 'solid 1px #000000', borderRadius: '10px', padding: '1rem', mb: '1rem' }}>
      <Box display="flex" alignItems="center">
        <Typography sx={{ mr: '0.5rem' }}>{entry.date}</Typography>
        <LocalHospitalIcon />
      </Box>
      <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map(code => {
            const diagnose: Diagnosis | undefined = diagnoses.find(diagnose => diagnose.code === code);
            return (
              <li key={code}>
                <Typography>{`${code} ${diagnose ? diagnose.name : ''}`}</Typography>
              </li>
            );
          })}
        </ul>
      )}
      <Typography>
        Discharged on: {entry.discharge.date} on the basis of {entry.discharge.criteria}
      </Typography>

      {entry.specialist && <Typography>Diagnose by: {entry.specialist}</Typography>}
    </Box>
  );
};

export default HospitalEntryDetails;
