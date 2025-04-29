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
import { primaryButtonStyle } from "@/app/Styles";
import { Info } from "lucide-react";

interface BidStatusConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  status: string;
  onConfirm: () => void;
  isProcessing: boolean;
}

const BidStatusConfirmDialog: FC<BidStatusConfirmDialogProps> = ({
  isOpen,
  onOpenChange,
  status,
  onConfirm,
  isProcessing,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <div className='flex w-full items-start mb-6 gap-2 mt-3 p-2 bg-green-50 rounded-lg border border-green-100'>
            <Info className='h-5 w-5 text-green-600 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-green-800'>
              <span className='font-semibold'>Note:</span> Bids marked as
              &apos;Selected&apos; will be automatically moved to the Reviewed
              Bids section for further evaluation and processing.
            </p>
          </div>
          <DialogDescription className='text-sm text-gray-700'>
            Are you sure you want to change the bid status to{" "}
            <span className='font-bold'>{status}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            className='rounded-mmd'
            onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={primaryButtonStyle}
            disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidStatusConfirmDialog;
