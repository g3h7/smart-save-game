import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Modulos from './pages/Modulos';
import Financas from './pages/Financas';
import Personagem from './pages/Personagem';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('inicio');

  // Simple Router Switch
  const renderContent = () => {
    switch (activeRoute) {
      case 'inicio':
        return <Home />;
      case 'modulos':
        return <Modulos />;
      case 'financas':
        return <Financas />;
      case 'personagem':
        return <Personagem />;
      case 'mapa':
        return (
          <div className="flex-1 flex items-center justify-center h-full animate-in fade-in duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-display font-black text-sidebar mb-2">ÁREA DO MAPA (Em breve)</h2>
              <p className="text-gray-400">O motor gráfico Phaser com o Tiled será integrado nesta aba futuramente.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center h-full animate-in fade-in duration-500">
             <div className="text-center">
              <h2 className="text-3xl font-display font-black text-sidebar mb-2">Área em Construção</h2>
              <p className="text-gray-400">Navegue pelas rotas Início e Módulos para ver a implementação ativa.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          {renderContent()}

          {/* Floating Action / Chat Button */}
          <button className="fixed bottom-8 right-8 bg-sidebar text-white p-4 rounded-full shadow-[0_8px_30px_rgb(17,24,39,0.3)] hover:scale-110 transition-transform flex items-center justify-center z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          </button>
        </main>
      </div>
    </div>
  );
}
