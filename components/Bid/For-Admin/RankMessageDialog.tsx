import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, SendHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { primaryButtonStyle } from "@/app/Styles";
import { IBidCard } from "@/Types/Bid-Types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendMailMutation } from "@/Redux/inform/informApi";
import { toast } from "sonner";

const RankMessageDialog = ({
  messageDialogOpen,
  setMessageDialogOpen,
  selectedBid,
}: {
  messageDialogOpen: boolean;
  setMessageDialogOpen: (open: boolean) => void;
  selectedBid: IBidCard | null;
}) => {
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");

  // const [sendCustomMail, { isLoading: isSendCustomMailLoading }] =
  //   useSendCustomMailMutation();

  const [sendMail, { isLoading: isSendMailLoading }] = useSendMailMutation();

  const handleSendMessage = async () => {
    try {
      await sendMail({
        email: selectedBid?.vendor_email,
        name: selectedBid?.vendor_name,
        message: messageText,
        // subject,
        type: "welcome",
      });

      toast.success("Email sent successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to send email");
    }
  };

  return (
    <Dialog
      open={messageDialogOpen}
      onOpenChange={setMessageDialogOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <MessageSquare className='h-5 w-5 text-primary' />
            Compose Email to Vendor
          </DialogTitle>
          <DialogDescription className='mt-2 text-left'>
            {selectedBid && (
              <>
                <span className='font-medium text-gray-700'>To:</span>{" "}
                {selectedBid.business_name}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='subject'>Subject</Label>
            <Input
              id='subject'
              placeholder='Enter email subject...'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              placeholder='Compose your email message here...'
              rows={8}
              className='resize-none'
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className='flex items-center justify-between'>
          <Button
            variant='outline'
            onClick={() => setMessageDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            className={primaryButtonStyle}
            onClick={handleSendMessage}
            disabled={
              isSendMailLoading || !messageText.trim() || !subject.trim()
            }>
            {isSendMailLoading ? (
              <>
                <Clock className='h-4 w-4 mr-2 animate-spin' />
                Sending...
              </>
            ) : (
              <>
                <SendHorizontal className='h-4 w-4 mr-2' />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RankMessageDialog;
