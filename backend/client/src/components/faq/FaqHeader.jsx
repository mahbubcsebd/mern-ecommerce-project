import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const FaqHeader = ({ onCreate }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
      <Button
        onClick={onCreate}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Create FAQ
      </Button>
    </div>
  );
};

export default FaqHeader;
