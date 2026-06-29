// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────
interface ChallanFooterProps {
  generatedAt: string; // e.g. "26-02-2026, 12:30 PM"
  systemName: string;  // e.g. "E-Learning & Earning Expense Management System"
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function ChallanFooter({
  generatedAt,
  systemName,
}: ChallanFooterProps) {
  return (
    <div className="text-center space-y-1 pt-2">
      <p className="text-xs text-slate-500">
        This Document is Generate By System, No Need Signature.
      </p>
      <p className="text-xs text-slate-400">
        This Document Was Generated On {generatedAt} | {systemName}
      </p>
      <p className="text-xs text-slate-400">
        For Any Query Please Contact The Administration Department
      </p>
    </div>
  );
}
