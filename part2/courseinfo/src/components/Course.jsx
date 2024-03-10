const Header = ({course}) => {
   return (
      <h2>{course}</h2>
   )
}

const Part = (props) => {
   let {name, exercises} = props.part
   return (
      <p>
         {name} {exercises}
      </p>
   )
}

const Content = ({ parts }) => {
   return (
      <div>
         {parts.map((part)=><Part key={part.id} part={part}/>)}
      </div>
   )
}

const Total = ({ parts }) => {
   const total = parts.reduce((acc, curr) =>  acc + curr.exercises, 0 );
   return (
      <p style={{ fontWeight: 'bold' }}>total of {total} exercises</p>
   )
}

const Course = (props) => {
const {name, parts, id} = props.course;
   return (
      <>
      <div>
         <Header course={name} />
         <Content parts={parts} />
         <Total parts={parts} />
      </div>
      </>

   )
}

export default Course