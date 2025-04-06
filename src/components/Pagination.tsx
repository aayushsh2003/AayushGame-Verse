
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { setPage } from '@/store/slices/filtersSlice';
import { Pagination as BsPagination } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(state => state.filters.page) || 1;
  
  // Calculate page range to display
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      dispatch(setPage(page));
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center my-8">
      <BsPagination>
        <BsPagination.Prev 
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </BsPagination.Prev>
        
        {startPage > 1 && (
          <>
            <BsPagination.Item onClick={() => handlePageChange(1)}>1</BsPagination.Item>
            {startPage > 2 && <BsPagination.Ellipsis disabled />}
          </>
        )}
        
        {pages.map(page => (
          <BsPagination.Item 
            key={page} 
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </BsPagination.Item>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <BsPagination.Ellipsis disabled />}
            <BsPagination.Item onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </BsPagination.Item>
          </>
        )}
        
        <BsPagination.Next 
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center"
        >
          <ChevronRight className="w-4 h-4" />
        </BsPagination.Next>
      </BsPagination>
    </div>
  );
};

export default Pagination;
