import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rejectionTemplates } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThumbsDown } from "lucide-react";
import { FC } from "react";

interface RejectBidDialogProps {
  rejectDialog: {
    isOpen: boolean;
    message: string;
  };
  setRejectDialog: (rejectDialog: RejectBidDialogProps["rejectDialog"]) => void;
  handleSelectTemplate: (template: string) => void;
  confirmRejectBid: () => void;
  isSettingBidStatus: boolean;
}

const RejectBidDialog: FC<RejectBidDialogProps> = ({
  rejectDialog,
  setRejectDialog,
  handleSelectTemplate,
  confirmRejectBid,
  isSettingBidStatus,
}) => {
  return (
    <Dialog
      open={rejectDialog.isOpen}
      onOpenChange={(isOpen) => setRejectDialog({ ...rejectDialog, isOpen })}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Reject Bid</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this bid. This message will be
            visible to the vendor.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Select a template message</p>
            <Select onValueChange={handleSelectTemplate}>
              <SelectTrigger>
                <SelectValue placeholder='Choose a template' />
              </SelectTrigger>
              <SelectContent>
                {rejectionTemplates.map((template, index) => (
                  <SelectItem
                    key={index}
                    value={template}>
                    {template.length > 50
                      ? `${template.substring(0, 50)}...`
                      : template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>Rejection message</p>
            <Textarea
              placeholder='Explain why this bid is being rejected...'
              value={rejectDialog.message}
              onChange={(e) =>
                setRejectDialog({ ...rejectDialog, message: e.target.value })
              }
              rows={4}
              className='resize-none'
            />
          </div>
        </div>

        <DialogFooter className='sm:justify-between'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setRejectDialog({ ...rejectDialog, isOpen: false })}>
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            className='gap-1'
            onClick={confirmRejectBid}
            disabled={isSettingBidStatus || !rejectDialog.message.trim()}>
            <ThumbsDown className='h-4 w-4' />
            {isSettingBidStatus ? "Processing..." : "Reject Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectBidDialog;
