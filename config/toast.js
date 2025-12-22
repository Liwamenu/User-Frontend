const toastOptions = {
  position: "top-right",
  style: {
    borderRadius: "0.5rem",
    border: "1px solid var(--border-1)",
    padding: "0.75rem 1rem",
    background: "var(--white-1)",
    color: "var(--black-2)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
    maxWidth: "32rem",
    fontSize: "0.875rem",
  },
  success: {
    duration: 5000,
    style: {
      border: "1px solid var(--green-1)",
    },
    iconTheme: {
      primary: "var(--status-green)",
      secondary: "#ffffff",
    },
  },
  error: {
    duration: 5000,
    style: {
      border: "1px solid var(--red-1)",
    },
    iconTheme: {
      primary: "var(--status-red)",
      secondary: "#ffffff",
    },
  },
};

export default toastOptions;
