import { useState } from "react";
import { Lightbulb, MapPin, Bell, BellOff, AlertCircle } from "lucide-react";

const schedule = [
  { time: "06:00 - 08:30", status: "completed", stage: 2 },
  { time: "14:00 - 16:30", status: "active", stage: 2 },
  { time: "20:00 - 22:30", status: "upcoming", stage: 2 },
];

export default function LoadSheddingScreen() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const currentStage = 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Load Shedding</h1>
          <p className="text-muted-foreground">Stay informed about power outages</p>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Current Status</p>
              <h2 className="text-2xl">Stage {currentStage}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Johannesburg, Area 12</span>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {alertsEnabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p>Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get alerted before outages
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              alertsEnabled ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                alertsEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <h3 className="text-lg mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {schedule.map((slot, index) => (
              <div
                key={index}
                className={`bg-card/50 backdrop-blur-lg rounded-2xl p-4 border ${
                  slot.status === "active"
                    ? "border-red-500/50 bg-red-500/10"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        slot.status === "completed"
                          ? "bg-green-500/20"
                          : slot.status === "active"
                          ? "bg-red-500/20"
                          : "bg-yellow-500/20"
                      }`}
                    >
                      <Lightbulb
                        className={`w-5 h-5 ${
                          slot.status === "completed"
                            ? "text-green-400"
                            : slot.status === "active"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p>{slot.time}</p>
                      <p className="text-xs text-muted-foreground">Stage {slot.stage}</p>
                    </div>
                  </div>
                  <div>
                    {slot.status === "completed" && (
                      <span className="text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                    {slot.status === "active" && (
                      <span className="text-xs text-red-400 bg-red-500/20 px-3 py-1 rounded-full animate-pulse">
                        Active Now
                      </span>
                    )}
                    {slot.status === "upcoming" && (
                      <span className="text-xs text-yellow-400 bg-yellow-500/20 px-3 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
                {slot.status === "active" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Time remaining</span>
                      <span className="text-red-400">1h 45m</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full w-[30%]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
          <h4 className="mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <span>Power Saving Tips</span>
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Charge devices and power banks before scheduled outages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Switch off geysers 30 minutes before load shedding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Use gas or alternative cooking methods during outages</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((stage) => (
            <button
              key={stage}
              className={`py-3 rounded-xl border-2 transition-all ${
                stage === currentStage
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : "border-border bg-card/50 text-muted-foreground hover:bg-card/70"
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
