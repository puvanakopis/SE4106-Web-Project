import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => (
  <div className="tran-pagination" aria-label="Pagination">
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-arrow"
    >
      &lt;
    </button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={`page-${i + 1}`}
        onClick={() => handlePageChange(i + 1)}
        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-arrow"
    >
      &gt;
    </button>
  </div>
);

export default Pagination;