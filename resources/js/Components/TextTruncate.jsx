import { cibDrone } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useState } from "react";

export default function TextTruncate({ text, limit = 100 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p>
        {expanded ? text : text.slice(0, limit) + (text.length > limit ? "..." : "")}
      </p>

      {text.length > limit && (
        <button onClick={() => setExpanded(!expanded)}>
         <CIcon icon={cibDrone} className="text-warning"/> {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );
}
