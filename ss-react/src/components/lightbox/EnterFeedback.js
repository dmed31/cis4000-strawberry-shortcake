import "./lightbox-btn.css"
import { Button } from "react-bootstrap"

function EnterFeedback({ clicked, onClick }) {
  return <Button 
    variant="primary" 
    className="lightbox-btn"
    onClick={onClick}>
    Enter Feedback
  </Button>
}

export default EnterFeedback;