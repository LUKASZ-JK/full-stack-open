import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

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

app.get('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'parameters missing' });
  }
  if (Array.isArray(daily_exercises) === false || isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  const validatedTarget: number = Number(target);
  const validatedExercises: number[] = [];

  try {
    daily_exercises.map(exercise => {
      if (isNaN(Number(exercise))) {
        throw new Error('malformatted parameters');
      } else {
        validatedExercises.push(Number(exercise));
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).send({ error: error.message });
    }
  }

  return res.status(200).send(calculateExercises(validatedExercises, validatedTarget));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
