import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import FaqForm from './FaqForm';

const FaqModals = ({
  isModalOpen,
  setIsModalOpen,
  mode,
  selectedFaq,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onDelete,
  faqToDelete,
}) => {
  return (
    <>
      {/* Edit/Create Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900 font-semibold mb-3">
              {mode === 'edit' ? 'Update FAQ' : 'Create FAQ'}
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <FaqForm
            mode={mode}
            faqId={selectedFaq?._id}
            defaultValues={selectedFaq}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
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
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onDelete(faqToDelete)}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FaqModals;
