
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Components
import NavBar from "./components/NavBar";
import Journal from "./components/Journal";
import Breathing from "./components/Breathing";
import Affirmations from "./components/Affirmations";
import Progress from "./components/Progress";
import Resources from "./components/Resources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col md:flex-row min-h-screen bg-background">
          <NavBar />
          <main className="flex-1 md:ml-16 lg:ml-48 pb-16 md:pb-0">
            <div className="container max-w-4xl mx-auto py-6 px-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/breathing" element={<Breathing />} />
                <Route path="/affirmations" element={<Affirmations />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
