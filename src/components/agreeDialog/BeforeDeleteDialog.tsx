import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  handleApprove: () => void;
}

function BeforeDeleteDialog({ open, title, handleApprove, onClose }: Props) {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Видалення {title}</DialogTitle>
        <DialogContent>Ви впевнені?</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Відміна</Button>
          <Button onClick={handleApprove}>Видалення</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BeforeDeleteDialog;
