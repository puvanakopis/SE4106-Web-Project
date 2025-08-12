import React from 'react';
import './ResultsHeader.css'

const ResultsHeader = ({ count }) => (
  <div className="acc-results-header full-width">
    <div className="results-header-content">
      <p className="results-count">
        Found <strong>{count}</strong> Rooms
      </p>
    </div>
  </div>
);

export default ResultsHeader;