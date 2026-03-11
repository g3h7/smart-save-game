import GameSidebar from "@/components/GameSidebar";
import GameHeader from "@/components/GameHeader";
import WelcomeBanner from "@/components/WelcomeBanner";
import FinanceSummary from "@/components/FinanceSummary";
import AvatarProgress from "@/components/AvatarProgress";
import XPTracker from "@/components/XPTracker";


const Index = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <GameSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <GameHeader />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinanceSummary />
            <div className="space-y-6">
              <AvatarProgress />
              <XPTracker />
            </div>
          </div>

          <ModulesGrid />
        </main>
      </div>
    </div>
  );
};

export default Index;
