import { Box, CircularProgress, Typography } from "@mui/material";

function LoaderPage() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Typography component="h1" variant="h1">
          Гарного вам робочого дня!!!
        </Typography>
        <CircularProgress size={100} />
      </Box>
    </>
  );
}

export default LoaderPage;
