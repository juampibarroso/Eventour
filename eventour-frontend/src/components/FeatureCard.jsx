import { Link } from "react-router-dom";
import "../styles/featureCard.css";

function FeatureCard({ title, link }) {
  return (
    <Link to={link} className="feature-card">
      <h2>{title}</h2>
    </Link>
  );
}

export default FeatureCard;
