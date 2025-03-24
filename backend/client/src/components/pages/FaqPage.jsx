import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useDeleteFAQMutation,
  useGetFaqsQuery,
  useReorderFAQsMutation,
} from '@/rtk/features/api/apiSlice';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { toast } from 'sonner'; // Import Sonner's toast function
import FAQForm from '../FAQForm';
import { SortableRow } from '../SortableRow'; // Create this component (see below)

const FaqPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [localFaqs, setLocalFaqs] = useState([]);

  const {
    data: faqs,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFaqsQuery({
    category: selectedCategory,
    isActive:
      selectedStatus === 'all' ? undefined : selectedStatus === 'active',
  });

  const [deleteFAQ] = useDeleteFAQMutation();
  const [reorderFAQs] = useReorderFAQsMutation();

  // Update localFaqs when the API data changes
  useMemo(() => {
    if (faqs?.data) {
      // Sort the FAQs by the 'order' field
      const sortedFaqs = [...faqs.data].sort((a, b) => a.order - b.order);
      setLocalFaqs(sortedFaqs);
    }
  }, [faqs]);

  const handleDelete = async (id) => {
    try {
      await deleteFAQ(id).unwrap();
      toast.success('FAQ deleted successfully!'); // Success toast
    } catch (err) {
      toast.error('Failed to delete FAQ.'); // Error toast
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (faq) => {
    setMode('edit');
    setSelectedFaq(faq);
    setIsModalOpen(true); // Open the modal
  };

  const handleCreate = () => {
    setMode('create');
    setSelectedFaq(null);
    setIsModalOpen(true); // Open the modal
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

  const handleRemoveFilter = (filterType) => {
    switch (filterType) {
      case 'category':
        setSelectedCategory('all');
        break;
      case 'status':
        setSelectedStatus('all');
        break;
      case 'search':
        setSearchQuery('');
        break;
      default:
        break;
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Add activationConstraint to prevent interference with buttons
      activationConstraint: {
        distance: 8, // Only start dragging after moving 8px
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = localFaqs.findIndex((faq) => faq._id === active.id);
      const newIndex = localFaqs.findIndex((faq) => faq._id === over.id);

      // Update local state immediately for optimistic UI update
      const newOrder = arrayMove(localFaqs, oldIndex, newIndex);
      setLocalFaqs(newOrder);

      // Update the order in the backend
      const orderedIds = newOrder.map((item) => item._id);
      try {
        await reorderFAQs(orderedIds).unwrap();
        toast.success('FAQs reordered successfully!');
      } catch (err) {
        toast.error('Failed to reorder FAQs.');
        // Revert the optimistic update if the API call fails
        setLocalFaqs(localFaqs);
      }
    }
  };

  const categories = [
    'all',
    'general',
    'payments',
    'shipping',
    'returns',
    'account',
  ];
  const statusOptions = ['all', 'active', 'inactive'];

  const filteredData = useMemo(() => {
    if (!localFaqs.length) return [];
    return localFaqs
      .filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.order - b.order); // Ensure filtered data is sorted
  }, [localFaqs, searchQuery]);

  const columns = useMemo(
    () => [
      {
        header: 'Question',
        accessorKey: 'question', // Ensure this matches the key in your data
      },
      {
        header: 'Answer',
        accessorKey: 'answer', // Ensure this matches the key in your data
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }) => (
          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md">
            {row.original.category}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-md text-white ${
              row.original.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {row.original.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleEdit(row.original);
              }}
              className="px-3 py-1 bg-green-500 text-white rounded-md"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleDeleteConfirmation(row.original._id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'question', desc: false }],
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto p-6 bg-gray-50 min-h-screen">
      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-gray-300 rounded-md flex-1"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create FAQ
          </button>
        </div>

        {/* Active Filters Breadcrumbs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              Category: {selectedCategory}
              <button
                onClick={() => handleRemoveFilter('category')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
          {selectedStatus !== 'all' && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              Status: {selectedStatus}
              <button
                onClick={() => handleRemoveFilter('status')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
          {searchQuery && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              Search: {searchQuery}
              <button
                onClick={() => handleRemoveFilter('search')}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
          {(selectedCategory !== 'all' ||
            selectedStatus !== 'all' ||
            searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {filteredData.length === 0 ? (
          <p className="text-center text-gray-500">No FAQ found!</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredData.map((faq) => faq._id)}
              strategy={verticalListSortingStrategy}
            >
              <table className="min-w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="bg-gray-100"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 border cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <SortableRow
                      key={row.id}
                      id={row.original._id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-2 border"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </SortableRow>
                  ))}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent>
          <FAQForm
            mode={mode}
            faqId={selectedFaq?._id}
            defaultValues={selectedFaq}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(faqToDelete)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaqPage;
