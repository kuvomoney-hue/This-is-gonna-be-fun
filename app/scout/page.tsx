import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { scoutAgent, scoutActivity, scoutStats } from "@/lib/mockData";

const activityTypeStyles = {
  reject:  "text-[#ef5350]",
  approve: "text-[#4caf50]",
  info:    "text-[#81c784]",
};

const activityTypeDot = {
  reject:  "bg-[#ef5350]",
  approve: "bg-[#4caf50]",
  info:    "bg-[#81c784]",
};

export default function ScoutPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">Scout</h1>
        <p className="text-[#81c784] text-sm mt-1">AI trading agent · signal analysis · risk management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Agent Status Card */}
        <Card title="Agent Status" className="lg:col-span-1">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#14591D]/30 border border-[#14591D]/40 flex items-center justify-center text-3xl">
                {scoutAgent.emoji}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8f5e9]">{scoutAgent.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={scoutAgent.status} pulse />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
                <span className="text-xs text-[#81c784]">Model</span>
                <span className="text-xs font-mono text-[#e8f5e9]">{scoutAgent.model}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
                <span className="text-xs text-[#81c784]">Status</span>
                <Badge variant="online" pulse />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#81c784]">Version</span>
                <span className="text-xs font-mono text-[#e8f5e9]">v0.1.0</span>
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <p className="text-xs text-[#81c784] uppercase tracking-wider mb-3">Capabilities</p>
              <div className="flex flex-wrap gap-2">
                {scoutAgent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-xs px-2.5 py-1 bg-[#14591D]/20 border border-[#14591D]/30 text-[#81c784] rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card title="Today's Stats" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0f0a] rounded-xl p-4 text-center">
              <p className="text-xs text-[#81c784] uppercase tracking-wider mb-2">Signals Analyzed</p>
              <p className="text-4xl font-mono font-bold text-[#e8f5e9]">{scoutStats.signalsAnalyzed}</p>
              <p className="text-xs text-[#81c784]/60 mt-1">{scoutStats.rejectedSignals} rejected</p>
            </div>
            <div className="bg-[#0a0f0a] rounded-xl p-4 text-center">
              <p className="text-xs text-[#81c784] uppercase tracking-wider mb-2">Trades Executed</p>
              <p className="text-4xl font-mono font-bold text-[#4caf50]">{scoutStats.tradesExecuted}</p>
              <p className="text-xs text-[#81c784]/60 mt-1">today</p>
            </div>
            <div className="bg-[#0a0f0a] rounded-xl p-4 text-center col-span-2">
              <p className="text-xs text-[#81c784] uppercase tracking-wider mb-2">Capital Protected</p>
              <p className="text-4xl font-mono font-bold text-[#4caf50]">
                ~${scoutStats.capitalProtected}
              </p>
              <p className="text-xs text-[#81c784]/60 mt-1">
                {scoutStats.rejectedSignals} bad signals blocked × ~$2 risk each
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Log */}
      <Card title="Recent Activity" subtitle="What Scout has been up to">
        <div className="space-y-0">
          {scoutActivity.map((item, i) => (
            <div
              key={item.id}
              className={`
                flex items-start gap-4 py-3.5
                ${i < scoutActivity.length - 1 ? "border-b border-[#1e3320]" : ""}
                group hover:bg-[#14591D]/5 -mx-5 px-5 transition-colors
              `}
            >
              {/* Timeline dot + line */}
              <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                <div className={`w-2 h-2 rounded-full ${activityTypeDot[item.type]}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm ${activityTypeStyles[item.type]}`}>
                  {item.text}
                </p>
                <p className="text-xs text-[#81c784]/40 mt-1 font-mono">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Integration placeholder */}
      <div className="flex items-center gap-3 p-4 border border-dashed border-[#1e3320] rounded-xl">
        <span className="text-2xl">🔌</span>
        <div>
          <p className="text-sm text-[#81c784] font-medium">Live Scout API Integration</p>
          <p className="text-xs text-[#81c784]/50 mt-0.5">
            Connect to live Scout agent via API endpoint — V2 roadmap
          </p>
        </div>
        <span className="ml-auto text-xs text-[#81c784]/40 border border-[#1e3320] px-2 py-1 rounded">
          V2
        </span>
      </div>
    </div>
  );
}
