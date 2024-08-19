import { Typography, Box } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import { Patient } from '../../types';

const SinglePatient = ({ patient }: { patient: Patient }) => {
  const genderIcon = patient.gender === 'male' ? <MaleIcon /> : patient.gender === 'female' ? <FemaleIcon /> : null;
  console.log(patient);
  const entries = patient.entries.map(entry => {
    return (
      <Box key={entry.id}>
        <Box display="flex">
          <Typography sx={{ mr: '0.5rem' }}>{entry.date}</Typography>
          <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
        </Box>
        <ul>
          {entry.diagnosisCodes?.map(code => (
            <li key={code}>
              <Typography>{code}</Typography>
            </li>
          ))}
        </ul>
      </Box>
    );
  });

  return (
    <Box mt={4}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" component="h2" sx={{ mr: '1rem' }}>
          {patient.name}
        </Typography>
        {genderIcon}
      </Box>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography variant="h5" component="h2" sx={{ mt: '1rem' }}>
        entries
      </Typography>
      {entries}
    </Box>
  );
};

export default SinglePatient;
