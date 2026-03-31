import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameMapProvider } from "@/contexts/GameMapContext";
import { CharacterProvider } from "@/contexts/CharacterContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login.tsx";
import Index from "./pages/Index.tsx";
import Financas from "./pages/Financas.tsx";
import GameMap from "./pages/GameMap.tsx";
import Modulos from "./pages/Modulos.tsx";
import Personagem from "./pages/Personagem.tsx";
import NotFound from "./pages/NotFound.tsx";
import ChatBot from "./components/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <GameMapProvider>
          <CharacterProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/financas" element={<ProtectedRoute><Financas /></ProtectedRoute>} />
                <Route path="/mapa" element={<ProtectedRoute><GameMap /></ProtectedRoute>} />
                <Route path="/modulos" element={<ProtectedRoute><Modulos /></ProtectedRoute>} />
                <Route path="/personagem" element={<ProtectedRoute><Personagem /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CharacterProvider>
        </GameMapProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
