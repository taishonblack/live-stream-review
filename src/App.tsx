import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateSession from "./pages/CreateSession";
import JoinSession from "./pages/JoinSession";
import SessionRoom from "./pages/SessionRoom";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { usePreferences } from "./hooks/use-preferences";

const queryClient = new QueryClient();

const AppShell = () => {
  const { prefs } = usePreferences();
  return (
    <div className={`min-h-screen ${prefs.showMetroBackground ? 'tecq-bg' : 'bg-background'}`}>
      <div className={`min-h-screen ${prefs.showMetroBackground ? 'tecq-bg-mask' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/join" element={<JoinSession />} />
          <Route path="/join/:token" element={<JoinSession />} />
          <Route path="/session/:id" element={<SessionRoom />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
