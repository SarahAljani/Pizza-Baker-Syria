import { useState } from "react";
import { Pizza, IceCreamCone, FileText, Settings, LogOut, ExternalLink, ChefHat } from "lucide-react";
import PizzasTab from "./PizzasTab";
import ExtrasTab from "./ExtrasTab";
import ContentTab from "./ContentTab";
import SettingsTab from "./SettingsTab";

const TABS = [
  { id: "pizzas", label: "Pizzas", icon: Pizza, Component: PizzasTab },
  { id: "extras", label: "Sides & Desserts", icon: IceCreamCone, Component: ExtrasTab },
  { id: "content", label: "Page Content", icon: FileText, Component: ContentTab },
  { id: "settings", label: "Settings", icon: Settings, Component: SettingsTab },
];

export default function DashboardShell({ onLogout }) {
  const [activeTab, setActiveTab] = useState("pizzas");
  const Active = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 flex-shrink-0 bg-bg-secondary border-b lg:border-b-0 lg:border-r border-border-primary flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border-primary">
          <div className="w-9 h-9 rounded-full bg-brand-burgundy/40 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
            <ChefHat className="w-4.5 h-4.5 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-sm text-text-primary uppercase tracking-wide truncate">
              Pizza Baker
            </p>
            <p className="text-[9px] font-mono text-brand-gold uppercase tracking-widest">
              Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-mono font-bold tracking-wide uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-brand-gold text-black"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-primary space-y-1">
          <a
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-mono font-bold tracking-wide uppercase text-text-secondary hover:text-brand-gold transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-mono font-bold tracking-wide uppercase text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
        <div className="max-w-6xl mx-auto">{Active && <Active />}</div>
      </main>
    </div>
  );
}
