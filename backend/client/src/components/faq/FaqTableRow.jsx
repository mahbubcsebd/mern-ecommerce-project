import { flexRender } from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';
import { SortableRow } from './SortableRow';

const FaqTableRow = ({ row, onEdit, onDelete }) => {
  if (!row?.original) return null;

  return (
    <SortableRow id={row.original._id}>
      <td className="px-6 py-4 whitespace-nowrap group-hover:bg-gray-50 transition-colors">
        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab hover:text-gray-600 transition-colors" />
      </td>
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:bg-gray-50 transition-colors"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </SortableRow>
  );
};

export default FaqTableRow;
