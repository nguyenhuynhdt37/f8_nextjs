"use client";
import { SnackbarProvider } from "notistack";

const SnackbarProviderConfig = ({ children }: { children: any }) => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      maxSnack={3}
      autoHideDuration={1500}
      classes={{
        containerRoot: "mt-[5rem]",
      }}
      style={{ fontSize: "1.2rem" }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarProviderConfig;
