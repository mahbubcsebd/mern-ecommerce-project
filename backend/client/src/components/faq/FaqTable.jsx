import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import FaqTableRow from './FaqTableRow';

const FaqTable = ({ data, onEdit, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns = useMemo(
    () => [
      {
        header: 'Question',
        accessorKey: 'question',
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate font-medium">
            {row.original.question}
          </div>
        ),
      },
      {
        header: 'Answer',
        accessorKey: 'answer',
        cell: ({ row }) => (
          <div className="max-w-[400px] truncate text-gray-600">
            {row.original.answer}
          </div>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="capitalize"
          >
            {row.original.category}
          </Badge>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        cell: ({ row }) => (
          <Badge
            variant={row.original.isActive ? 'default' : 'secondary'}
            className={
              row.original.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }
          >
            {row.original.isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.original)}
                    className="hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit FAQ</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(row.original._id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete FAQ</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        ),
      },
    ],
    [onEdit, onDelete] // Add dependencies here
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._id,
  });

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.findIndex((faq) => faq._id === active.id);
    const newIndex = data.findIndex((faq) => faq._id === over.id);

    const newOrder = arrayMove(data, oldIndex, newIndex);

    try {
      await onReorder(newOrder.map((faq) => faq._id)).unwrap();
    } catch (err) {
      console.error('Failed to reorder FAQs:', err);
    }
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      {data.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No FAQs found</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((faq) => faq._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      <th className="w-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {/* Drag handle column */}
                      </th>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <FaqTableRow
                      key={row.id}
                      row={row}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default FaqTable;
