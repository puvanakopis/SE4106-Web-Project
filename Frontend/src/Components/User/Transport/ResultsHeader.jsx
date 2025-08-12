import React from 'react';
import './ResultsHeader.css';

const ResultsHeader = ({ count }) => (
  <div className="tran-results-header full-width">
    <div className="results-header-content">
      <p className="results-count">
        Found <strong>{count}</strong> Vehicles
      </p>
    </div>
  </div>
);

export default ResultsHeader;