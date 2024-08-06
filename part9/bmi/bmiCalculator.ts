const calculateBmi = (height: number, weight: number): string => {
  if (isNaN(height) || isNaN(weight)) throw new Error('Provide weight and height as numbers');
  const bmi: number = weight / Math.pow(height / 100, 2);
  if (bmi < 18.5) return 'Underweight';
  else if (bmi < 25) return 'Normal (healthy weight)';
  else if (bmi < 30) return 'Overweight';
  else if (bmi < 35) return 'Obese Class I';
  else if (bmi < 40) return 'Obese Class II';
  else return 'Obese Class III';
};

const height: number = Number(process.argv[2]);
const weight: number = Number(process.argv[3]);

try {
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}

//console.log(calculateBmi(180, 74));
