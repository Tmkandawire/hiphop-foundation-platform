import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";

// Third-party Library Imports (Fonts, UI Libraries)
import "@fontsource/inter";
import "@fontsource/poppins";

// Local Logic & Context
import { AuthProvider } from "./context/AuthContext";

//Components & Global Styles
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster />
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
