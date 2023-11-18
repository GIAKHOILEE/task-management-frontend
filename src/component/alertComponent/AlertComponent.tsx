import React, { useEffect, useState } from "react";
import styles from "./alertComponent.module.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

interface AlertComponentProps {
  severity: "error" | "warning" | "info" | "success";
  message: string;
}
export default function AlertComponent({
  severity,
  message,
}: AlertComponentProps) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity={severity}>{message}</Alert>
    </Stack>
  );
}
