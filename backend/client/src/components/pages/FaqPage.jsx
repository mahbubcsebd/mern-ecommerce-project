import {
  useDeleteFAQMutation,
  useGetFaqsQuery,
  useReorderFAQsMutation,
} from '@/rtk/features/api/apiSlice';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import FaqFilters from '../faq/FaqFilters';
import FaqHeader from '../faq/FaqHeader';
import FaqModals from '../faq/FaqModals';
import FaqTable from '../faq/FaqTable';

const FaqPage = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [localFaqs, setLocalFaqs] = useState([]);
  const [searchFields, setSearchFields] = useState([
    '_id',
    'question',
    'answer',
  ]);
  const [exactMatch, setExactMatch] = useState(false);

  // RTK Query hooks
  const {
    data: faqs,
    isLoading,
    isError,
    error,
  } = useGetFaqsQuery({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    isActive:
      selectedStatus !== 'all' ? selectedStatus === 'active' : undefined,
  });

  const [deleteFAQ] = useDeleteFAQMutation();
  const [reorderFAQs] = useReorderFAQsMutation();

  // Effects
  useEffect(() => {
    if (faqs?.data) {
      const sortedFaqs = [...faqs.data].sort((a, b) => a.order - b.order);
      setLocalFaqs(sortedFaqs);
    }
  }, [faqs]);

  // Handlers
  const handleDelete = async (id) => {
    try {
      await deleteFAQ(id).unwrap();
      toast.success('FAQ deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete FAQ.');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (faq) => {
    setMode('edit');
    setSelectedFaq(faq);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setMode('create');
    setSelectedFaq(null);
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = (id) => {
    setFaqToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Memoized data
const filteredData = useMemo(() => {
  if (!localFaqs.length) return [];

  return (
    localFaqs
      // Then in filter:
      .filter((faq) => {
        const searchTerm = searchQuery.toLowerCase();
        if (exactMatch) {
          return (
            faq._id.toLowerCase() === searchTerm ||
            faq.question.toLowerCase() === searchTerm ||
            faq.answer.toLowerCase() === searchTerm
          );
        } else {
          return (
            faq._id.toLowerCase().includes(searchTerm) ||
            faq.question.toLowerCase().includes(searchTerm) ||
            faq.answer.toLowerCase().includes(searchTerm)
          );
        }
      })
      .sort((a, b) => a.order - b.order)
  );
}, [localFaqs, searchQuery]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <FaqHeader onCreate={handleCreate} />

      <FaqFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleClearFilters={handleClearFilters}
      />

      <FaqTable
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirmation}
        onReorder={reorderFAQs}
      />

      <FaqModals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        mode={mode}
        selectedFaq={selectedFaq}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        faqToDelete={faqToDelete}
      />
    </div>
  );
};

export default FaqPage;
