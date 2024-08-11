import { CoursePart } from '../types';
import Part from './Part';

const Content = ({ parts }: { parts: CoursePart[] }) => {
  return parts.map(part => (
    <div key={part.name}>
      <Part part={part} />
    </div>
  ));
};

export default Content;
