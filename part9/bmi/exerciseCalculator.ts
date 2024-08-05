interface Evaluation {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exercises: number[], target: number): Evaluation => {
  const periodLength: number = exercises.length;
  const trainingDays: number = exercises.filter(day => day !== 0).length;
  const average: number = exercises.reduce((acc, curr) => acc + curr, 0) / periodLength;
  const success: boolean = average >= target ? true : false;

  let rating: number;
  if (average < target) rating = 1;
  else if (average === target) rating = 2;
  else rating = 3;

  let ratingDescription: string;
  switch (rating) {
    case 1:
      ratingDescription = 'Put in more work';
      break;
    case 2:
      ratingDescription = 'Exactly like you wanted!';
      break;
    case 3:
      ratingDescription = 'Wow! Keep it up!';
      break;
    default:
      ratingDescription = 'There has been an error';
      break;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
