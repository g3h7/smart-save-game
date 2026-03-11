import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Gamepad2, Shield, TrendingUp, Trophy } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("educash-user", JSON.stringify({ name: form.name || "Jogador", email: form.email }));
      navigate("/dashboard");
    }, 800);
  };

  const features = [
    { icon: TrendingUp, text: "Aprenda a investir de forma divertida" },
    { icon: Shield, text: "Controle suas finanças como um herói" },
    { icon: Trophy, text: "Ganhe XP e suba de nível" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-md text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <Gamepad2 className="text-primary-foreground" size={48} />
            <h1 className="font-display text-5xl font-bold text-primary-foreground">
              EDUCA<span className="text-accent">$</span>H
            </h1>
          </div>
          <p className="text-primary-foreground/80 font-body text-lg">
            O mini-game que transforma educação financeira em uma aventura épica!
          </p>
          <div className="space-y-4 mt-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-5 py-3">
                <f.icon className="text-accent shrink-0" size={24} />
                <span className="text-primary-foreground font-body font-semibold text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="text-primary" size={36} />
            <h1 className="font-display text-3xl font-bold text-foreground">
              EDUCA<span className="text-accent">$</span>H
            </h1>
          </div>

          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isLogin ? "BEM-VINDO DE VOLTA!" : "CRIAR CONTA"}
            </h2>
            <p className="text-muted-foreground font-body text-sm mt-1">
              {isLogin ? "Entre para continuar sua jornada" : "Comece sua aventura financeira"}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-display font-bold text-sm transition-all ${
                isLogin ? "bg-primary text-primary-foreground shadow-button" : "text-muted-foreground"
              }`}
            >
              ENTRAR
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-display font-bold text-sm transition-all ${
                !isLogin ? "bg-primary text-primary-foreground shadow-button" : "text-muted-foreground"
              }`}
            >
              CADASTRAR
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="font-display text-sm font-semibold text-foreground block mb-1.5">NOME DO HERÓI</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: CavaleiroDasFinanças"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            )}

            <div>
              <label className="font-display text-sm font-semibold text-foreground block mb-1.5">E-MAIL</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="heroi@educash.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div>
              <label className="font-display text-sm font-semibold text-foreground block mb-1.5">SENHA</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-display font-bold text-sm bg-primary text-primary-foreground shadow-button hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Gamepad2 size={18} />
                  {isLogin ? "INICIAR JORNADA" : "CRIAR HERÓI"}
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs font-body">
            {isLogin ? "Não tem conta? " : "Já tem conta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Crie agora!" : "Entre aqui!"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
