import './Heading.css'

const Heading = (props) => {
  return (
    <div className='Heading'>
      <div className="title">
        {props.title}
      </div>
    </div>
  )
}

export default Heading