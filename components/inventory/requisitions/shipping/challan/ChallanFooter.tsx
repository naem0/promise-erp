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
    <div className="text-center space-y-1 pt-4 border-t border-slate-200">
      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
        This Document Is Generate By System. No Need Signature.
      </p>
      <p className="text-[11px] text-slate-400 font-medium">
        This Document Was Generator On {generatedAt} | {systemName}
      </p>
      <p className="text-[11px] text-slate-400 font-medium">
        For Any Query Please Contact The Administration Department
      </p>
    </div>
  );
}
