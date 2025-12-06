import './Loading.css'

const Loading = ({ text = "Loading, please wait..." }) => {
  return (
    <div className="loading-container">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>{text}</p>
        </div>
      </div>
  )
}

export default Loading