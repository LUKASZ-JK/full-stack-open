import { Typography, Box } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import { Patient } from '../../types';
import SingleEntry from '../SingleEntry';

const SinglePatient = ({ patient }: { patient: Patient }) => {
  const genderIcon = patient.gender === 'male' ? <MaleIcon /> : patient.gender === 'female' ? <FemaleIcon /> : null;

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
      {patient.entries.map(entry => (
        <SingleEntry key={entry.id} entry={entry} />
      ))}
    </Box>
  );
};

export default SinglePatient;
