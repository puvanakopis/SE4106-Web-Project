import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="pagination-arrow"
      aria-label="Previous page"
    >
      &lt;
    </button>

    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={`page-${i + 1}`}
        onClick={() => onPageChange(i + 1)}
        className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
        aria-label={`Page ${i + 1}`}
        aria-current={currentPage === i + 1 ? 'page' : undefined}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="pagination-arrow"
      aria-label="Next page"
    >
      &gt;
    </button>
  </div>
);

export default Pagination;