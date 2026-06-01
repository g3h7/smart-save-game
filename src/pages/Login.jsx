import React, { useState, useEffect } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password requirements validation state
  const [requirements, setRequirements] = useState({
    length: false,
    number: false,
    special: false,
    uppercase: false,
    lowercase: false,
  });

  // Run validation on password change
  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      number: /[0-9]/.test(password),
      special: /[#@$!]/.test(password),
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
    });
  }, [password]);

  // Check if all requirements are met
  const isPasswordValid = Object.values(requirements).every(Boolean);
  const isFormValid = username.trim() !== '' && isPasswordValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setErrorMsg('MISSÃO BLOQUEADA: Preencha todos os campos corretamente!');
      return;
    }
    setErrorMsg('');
    onLogin(username);
  };

  return (
    <div className="min-h-screen w-full pixel-grass-bg font-pixel flex flex-col items-center justify-center p-4 selection:bg-[#fadb5f] selection:text-[#4a3319] overflow-y-auto">
      {/* 2D Floating elements for extra RPG immersion */}
      <div className="absolute top-8 left-8 text-white text-[10px] hidden md:block opacity-75 animate-bounce select-none">
        🌿 MUNDO: FAZENDA EDUCA$H
      </div>
      <div className="absolute top-8 right-8 text-white text-[10px] hidden md:block opacity-75 select-none">
        VERSÃO: 1.0.0 (BETA)
      </div>

      {/* GAME TITLE */}
      <div className="text-center mb-8 relative animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 
          className="text-4xl md:text-5xl font-black tracking-wider"
          style={{
            color: '#fadb5f',
            textShadow: '4px 4px 0px #4a3319, -2px -2px 0px #4a3319, 2px -2px 0px #4a3319, -2px 2px 0px #4a3319, 4px 0px 0px #4a3319, 0px 4px 0px #4a3319'
          }}
        >
          EDUCA$H
        </h1>
        <p className="text-[10px] text-white mt-4 tracking-normal drop-shadow-[2px_2px_0px_rgba(74,51,25,1)]">
          O RPG DA SUA VIDA FINANCEIRA
        </p>
      </div>

      {/* MAIN CONTAINER (RPG MENU) */}
      <div className="w-full max-w-4xl bg-[#e5c59a] border-[8px] border-[#734c31] pixel-shadow-md p-6 md:p-8 animate-in zoom-in-95 duration-300 relative">
        
        {/* Decorative corner pixels / hinges to simulate premium retro boards */}
        <div className="absolute -top-[8px] -left-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -top-[8px] -right-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -bottom-[8px] -left-[8px] w-4 h-4 bg-[#4a3319]"></div>
        <div className="absolute -bottom-[8px] -right-[8px] w-4 h-4 bg-[#4a3319]"></div>

        {errorMsg && (
          <div className="w-full bg-[#fce8e6] border-4 border-[#ef4444] text-[#ef4444] text-[10px] p-3 mb-6 text-center leading-relaxed pixel-shadow-sm animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUNA DA ESQUERDA (FORMULÁRIO DE LOGIN) */}
          <div className="flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* SUBTITLE */}
              <div className="text-center md:text-left border-b-4 border-[#734c31] pb-3">
                <h2 className="text-sm font-bold text-[#52331c] tracking-wider">
                  [ ACESSAR CONTA ]
                </h2>
              </div>

              {/* USERNAME FIELD */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#52331c] uppercase tracking-wider">
                  NOME DE USUÁRIO:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Jogador_1"
                  className="w-full bg-[#fff4e0] border-4 border-[#734c31] p-3 text-xs text-[#52331c] placeholder:text-[#baa07b] focus:outline-none focus:bg-white rounded-none transition-colors"
                  required
                />
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#52331c] uppercase tracking-wider">
                  SENHA DE ACESSO:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full bg-[#fff4e0] border-4 border-[#734c31] py-3 pl-3 pr-16 text-xs text-[#52331c] placeholder:text-[#baa07b] focus:outline-none focus:bg-white rounded-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-[6px] bottom-[6px] px-3 bg-[#e5c59a] border-2 border-[#734c31] text-[9px] font-bold text-[#52331c] hover:bg-[#fff4e0] active:translate-y-[1px] transition-all flex items-center justify-center rounded-none"
                  >
                    {showPassword ? 'OCULTAR' : 'VER'}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                {isFormValid ? (
                  <button
                    type="submit"
                    className="w-full bg-[#5cb85c] border-x-4 border-t-4 border-[#5cb85c] border-b-[6px] border-[#2b612b] text-white text-xs font-bold py-4 px-6 text-center select-none active:translate-y-1 active:border-b-2 hover:brightness-105 transition-all rounded-none cursor-pointer"
                    style={{
                      textShadow: '2px 2px 0px #1e461e'
                    }}
                  >
                    JOGAR!
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-[#9ca3af] border-x-4 border-t-4 border-[#9ca3af] border-b-[6px] border-[#4b5563] text-[#d1d5db] text-xs font-bold py-4 px-6 text-center select-none rounded-none opacity-80 cursor-not-allowed"
                    style={{
                      textShadow: '2px 2px 0px #374151'
                    }}
                  >
                    BLOQUEADO 🔒
                  </button>
                )}
              </div>
            </form>

            {/* LINKS INFERIORES */}
            <div className="flex flex-row justify-between items-center text-[9px] mt-8 pt-4 border-t-4 border-[#734c31] text-[#52331c] font-bold">
              <a 
                href="#criar-conta" 
                onClick={(e) => { e.preventDefault(); alert('Missão secundária: Criar Conta estará disponível em breve!'); }}
                className="hover:text-white underline tracking-wider"
              >
                CRIAR CONTA
              </a>
              <a 
                href="#esqueci-senha" 
                onClick={(e) => { e.preventDefault(); alert('Dica do NPC: Tente lembrar a sua senha antiga!'); }}
                className="hover:text-white underline tracking-wider"
              >
                ESQUECI A SENHA
              </a>
            </div>
          </div>

          {/* COLUNA DA DIREITA (PAINEL DE REQUISITOS DA SENHA) */}
          <div className="bg-[#f7e6c4] border-4 border-[#baa07b] p-4 flex flex-col justify-between relative">
            {/* Quest Panel Header */}
            <div>
              <div className="border-b-2 border-[#baa07b] pb-2 mb-4 text-center">
                <h3 className="text-xs font-bold text-[#52331c] tracking-wider">
                  📜 DIÁRIO DE MISSÕES
                </h3>
                <span className="text-[8px] font-bold text-[#baa07b] block mt-1">
                  REQUISITOS DA SENHA
                </span>
              </div>

              {/* Requirement Checklist */}
              <ul className="space-y-3.5 text-[9px] text-[#52331c] font-bold">
                <li className="flex items-center gap-2">
                  <span className={`text-[12px] ${requirements.length ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {requirements.length ? '✔' : '✖'}
                  </span>
                  <span className={requirements.length ? 'line-through text-gray-500' : ''}>
                    1. 8+ CARACTERES
                  </span>
                </li>
                
                <li className="flex items-center gap-2">
                  <span className={`text-[12px] ${requirements.number ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {requirements.number ? '✔' : '✖'}
                  </span>
                  <span className={requirements.number ? 'line-through text-gray-500' : ''}>
                    2. 1 NÚMERO (0-9)
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <span className={`text-[12px] ${requirements.special ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {requirements.special ? '✔' : '✖'}
                  </span>
                  <span className={requirements.special ? 'line-through text-gray-500' : ''}>
                    3. 1 CARACTERE ESPECIAL (#@$!)
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <span className={`text-[12px] ${requirements.uppercase ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {requirements.uppercase ? '✔' : '✖'}
                  </span>
                  <span className={requirements.uppercase ? 'line-through text-gray-500' : ''}>
                    4. 1 LETRA MAIÚSCULA (A)
                  </span>
                </li>

                <li className="flex items-center gap-2">
                  <span className={`text-[12px] ${requirements.lowercase ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {requirements.lowercase ? '✔' : '✖'}
                  </span>
                  <span className={requirements.lowercase ? 'line-through text-gray-500' : ''}>
                    5. 1 LETRA MINÚSCULA (a)
                  </span>
                </li>
              </ul>
            </div>

            {/* Quest Status Indicator */}
            <div className="mt-6 border-t-2 border-[#baa07b] pt-3 text-center">
              {isPasswordValid ? (
                <div className="text-[#10b981] text-[9px] animate-pulse">
                  ✨ MISSÃO COMPLETA! JOGAR HABILITADO.
                </div>
              ) : (
                <div className="text-[#baa07b] text-[8px] leading-relaxed">
                  COMPLETE TODAS AS MISSÕES DE SEGURANÇA PARA DESBLOQUEAR O BOTÃO JOGAR.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Footer RPG message */}
      <div className="mt-8 text-center text-white text-[9px] tracking-normal select-none">
        <p className="drop-shadow-[1px_1px_0px_rgba(74,51,25,1)]">
          Pressione ESC ou clique em JOGAR para entrar no mundo.
        </p>
      </div>
    </div>
  );
}
