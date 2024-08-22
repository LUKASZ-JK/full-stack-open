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
import { Entry, HealthCheckRating, NewEntry } from '../../types';
import { DiagnosesContext } from '../../App';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { assertNever } from '../../utils';

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

  //const entryTypes: Entry['type'][] = ['HealthCheck', 'OccupationalHealthcare', 'Hospital'];
  const entryTypes: { type: Entry['type']; label: string }[] = [
    { type: 'HealthCheck', label: 'Health check' },
    { type: 'OccupationalHealthcare', label: 'Occupational healthcare' },
    { type: 'Hospital', label: 'Hospital' },
  ];

  const [entryType, setEntryType] = useState(entryTypes[0].type);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<DateTime | null>(DateTime.now());
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [dischargeDate, setDischargeDate] = useState<DateTime | null>(DateTime.now());
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState<DateTime | null>(DateTime.now());
  const [sickLeaveEnd, setSickLeaveEnd] = useState<DateTime | null>(DateTime.now());

  const theme = useTheme();

  const handleDiagnosisSelectChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleHealthCheckRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealthCheckRating(Number(event.target.value));
  };

  const handleAdd = (event: SyntheticEvent) => {
    event.preventDefault();
    const baseEntry = {
      type: entryType,
      description,
      date: date?.toISODate() || '',
      specialist,
      diagnosisCodes,
    };
    switch (entryType) {
      case 'Hospital':
        addEntry({
          ...baseEntry,
          type: 'Hospital',
          discharge: { date: dischargeDate?.toISODate() || '', criteria: dischargeCriteria },
        });
        break;
      case 'OccupationalHealthcare':
        addEntry({
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave: {
            startDate: sickLeaveStart?.toISODate() || '',
            endDate: sickLeaveEnd?.toISODate() || '',
          },
        });
        break;
      case 'HealthCheck':
        addEntry({ ...baseEntry, type: 'HealthCheck', healthCheckRating });
        break;
      default:
        assertNever(entryType);
    }
    setDescription('');
    setDate(DateTime.now());
    setSpecialist('');
    setDiagnosisCodes([]);
    setDischargeDate(DateTime.now());
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStart(DateTime.now());
    setSickLeaveEnd(DateTime.now());
    setHealthCheckRating(HealthCheckRating.Healthy);
  };

  const entryButtons = entryTypes.map(type => (
    <Button
      key={type.type}
      variant={`${type.type === entryType ? 'contained' : 'outlined'}`}
      color="primary"
      size="small"
      sx={{ mr: 1 }}
      onClick={() => setEntryType(type.type)}>
      {type.label}
    </Button>
  ));

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
              onChange={handleDiagnosisSelectChange}
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
          {entryType === 'HealthCheck' ? (
            <FormControl sx={{ m: 1 }}>
              <FormLabel>Rating</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={healthCheckRating}
                onChange={handleHealthCheckRadioChange}
                row>
                <FormControlLabel value={HealthCheckRating.Healthy} control={<Radio />} label="Healthy" />
                <FormControlLabel value={HealthCheckRating.LowRisk} control={<Radio />} label="Low risk" />
                <FormControlLabel value={HealthCheckRating.HighRisk} control={<Radio />} label="High risk" />
                <FormControlLabel value={HealthCheckRating.CriticalRisk} control={<Radio />} label="Critical risk" />
              </RadioGroup>
            </FormControl>
          ) : null}
          {entryType === 'OccupationalHealthcare' ? (
            <>
              <TextField
                type="text"
                label="Employer name"
                required
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
              />
              <DatePicker
                label="Sick leave start"
                value={sickLeaveStart}
                onChange={newValue => setSickLeaveStart(newValue)}
              />
              <DatePicker
                label="Sick leave end"
                value={sickLeaveEnd}
                onChange={newValue => setSickLeaveEnd(newValue)}
              />
            </>
          ) : null}
          {entryType === 'Hospital' ? (
            <>
              <>
                <DatePicker label="Discharge" value={dischargeDate} onChange={newValue => setDischargeDate(newValue)} />
                <TextField
                  type="text"
                  label="Discharge criteria"
                  required
                  value={dischargeCriteria}
                  onChange={({ target }) => setDischargeCriteria(target.value)}
                />
              </>
            </>
          ) : null}
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
