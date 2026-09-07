import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { primaryButtonStyle } from "@/app/styles";
import { Info } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SavedTenderDeleteDialog: FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <div className='flex w-full items-start mb-6 gap-2 mt-3 p-2 bg-red-50 rounded-lg border border-red-100'>
            <Info className='h-5 w-5 text-red-600 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-red-800'>
              <span className='font-semibold'>Note:</span> This action cannot be
              undone.
            </p>
          </div>
          <DialogDescription className='text-sm text-gray-700'>
            Are you sure you want to delete this saved tender?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            className='rounded-mmd'
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={primaryButtonStyle}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedTenderDeleteDialog;
