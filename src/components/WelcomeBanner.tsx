import heroImg from "@/assets/hero-character.png";

const WelcomeBanner = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-game-navy-dark p-6 flex items-center gap-4">
      <img src={heroImg} alt="Personagem" className="w-20 h-20 object-contain animate-bounce-soft" />
      <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground tracking-wide">
        BEM-VINDO, AVENTUREIRO!
      </h2>
    </div>
  );
};

export default WelcomeBanner;
