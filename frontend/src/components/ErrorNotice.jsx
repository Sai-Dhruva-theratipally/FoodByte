import React from "react";

export default function ErrorNotice({ error }) {
  if (!error) return null;

  const message =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

  return <div className="notice error">{message}</div>;
}
