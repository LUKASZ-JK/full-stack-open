import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);
  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }
  return res.status(200).send({ weight, height, bmi: calculateBmi(height, weight) });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
