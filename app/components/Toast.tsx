"use client";
import { useEffect } from "react";

export default function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error";
  onClose?: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg =
    type === "success"
      ? "bg-emerald-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-gray-700";

  return (
    <div
      className={`fixed right-6 bottom-6 z-50 px-4 py-2 rounded text-white ${bg} shadow-lg`}
    >
      {message}
    </div>
  );
}
