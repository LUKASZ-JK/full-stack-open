import { useContext } from 'react';
import { DiagnosesContext } from '../../App';
import { Diagnosis, HealthCheckEntry, HealthCheckRating } from '../../types';
import { Typography, Box } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircleIcon from '@mui/icons-material/Circle';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import { assertNever } from '../../utils';
import { yellow } from '@mui/material/colors';

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  const diagnoses = useContext(DiagnosesContext);

  let ratingIcon: JSX.Element;

  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      ratingIcon = <FavoriteIcon color="success" />;
      break;
    case HealthCheckRating.LowRisk:
      ratingIcon = <CircleIcon sx={{ color: yellow[500] }} />;
      break;
    case HealthCheckRating.HighRisk:
      ratingIcon = <CircleIcon color="error" />;
      break;
    case HealthCheckRating.CriticalRisk:
      ratingIcon = <HeartBrokenIcon color="error" />;
      break;
    default:
      return assertNever(entry.healthCheckRating);
  }

  return (
    <Box sx={{ border: 'solid 1px #000000', borderRadius: '10px', padding: '1rem', mb: '1rem' }}>
      <Box display="flex" alignItems="center">
        <Typography sx={{ mr: '0.5rem' }}>{entry.date}</Typography>
        <MedicalServicesIcon />
      </Box>
      <Typography sx={{ fontStyle: 'italic' }}>{entry.description}</Typography>
      {ratingIcon}
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

export default HealthCheckEntryDetails;
