import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { SyntheticEvent, useContext, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import { HealthCheckRating, NewEntry } from '../../types';
import { DiagnosesContext } from '../../App';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

interface Props {
  setToggle: () => void;
  addEntry: (values: NewEntry) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(code: string, diagnosisCodes: readonly string[], theme: Theme) {
  return {
    fontWeight:
      diagnosisCodes.indexOf(code) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const EntryForm = ({ setToggle, addEntry }: Props) => {
  const diagnoses = useContext(DiagnosesContext);

  const entryTypes = ['Health Check', 'Occupational Healthcare', 'Hospital'];

  const [entryType, setEntryType] = useState('Health Check');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<DateTime | null>(DateTime.now());
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleAdd = (event: SyntheticEvent) => {
    event.preventDefault();
    addEntry({
      type: 'HealthCheck',
      description,
      date: date?.toISODate() || '',
      specialist,
      diagnosisCodes,
      healthCheckRating,
    });

    setToggle();
    setDescription('');
    setDate(DateTime.now());
    setSpecialist('');
    setDiagnosisCodes([]);
    setHealthCheckRating(HealthCheckRating.Healthy);
  };

  const entryButtons = entryTypes.map(type => (
    <Button
      key={type}
      variant={`${type === entryType ? 'contained' : 'outlined'}`}
      color="primary"
      size="small"
      sx={{ mr: 1 }}
      onClick={() => setEntryType(type)}>
      {type}
    </Button>
  ));

  const HealthCheckRatingForm = () => {
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setHealthCheckRating(Number(event.target.value));
    };
    return (
      <FormControl sx={{ m: 1 }}>
        <FormLabel>Rating</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={healthCheckRating}
          onChange={handleRadioChange}
          row>
          <FormControlLabel value={HealthCheckRating.Healthy} control={<Radio />} label="Healthy" />
          <FormControlLabel value={HealthCheckRating.LowRisk} control={<Radio />} label="Low risk" />
          <FormControlLabel value={HealthCheckRating.HighRisk} control={<Radio />} label="High risk" />
          <FormControlLabel value={HealthCheckRating.CriticalRisk} control={<Radio />} label="Critical risk" />
        </RadioGroup>
      </FormControl>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-gb">
      <Box mt={2} display={'flex'}>
        {entryButtons}
      </Box>
      <Box my={2}>
        <Box
          component={'form'}
          onSubmit={handleAdd}
          display={'flex'}
          flexDirection={'column'}
          sx={{
            '& .MuiTextField-root': { m: 1, width: '50ch' },
          }}>
          <TextField
            type="text"
            label="Description"
            required
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <DatePicker label="Date" value={date} onChange={newValue => setDate(newValue)} />
          <TextField
            type="text"
            label="Specialist"
            required
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
          <FormControl sx={{ m: 1, width: '50ch' }}>
            <InputLabel>Codes</InputLabel>
            <Select
              multiple
              value={diagnosisCodes}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}>
              {diagnoses.map(diagnosis => (
                <MenuItem
                  key={diagnosis.code}
                  value={diagnosis.code}
                  style={getStyles(diagnosis.code, diagnosisCodes, theme)}>
                  {`${diagnosis.code} ${diagnosis.name}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {entryType === 'Health Check' ? <HealthCheckRatingForm /> : null}
          <Box display={'flex'}>
            <Button variant="contained" color="success" type="submit" sx={{ mr: 4 }}>
              Add
            </Button>
            <Button variant="contained" color="error" onClick={setToggle}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EntryForm;
