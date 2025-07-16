import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster
            visibleToasts={5}
            theme="dark"
            position="bottom-right"
            richColors
          />
        </QueryClientProvider>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>
);
