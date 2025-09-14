import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import type React from "react";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}
export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const sendEmail = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    // TODO: send reset password
    console.log(email);
    handleClose();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: sendEmail,
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Відновити Пароль</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Введіть ваш емеіл і ми звяжемося з вами для відновлення доступу.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Назад</Button>
        <Button variant="contained" type="submit">
          Продовжити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
