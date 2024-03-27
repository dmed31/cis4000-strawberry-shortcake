import "./lightbox-btn.css"
import { Button } from "react-bootstrap"

function ApplyFilter({ clicked, onClick }) {
  return <Button 
    variant="secondary"
    className="lightbox-btn"
    onClick={onClick}>
    Apply Filter
  </Button>
}

export default ApplyFilter;