import React from "react";

const RewardToast = ({ toast, onClose }) => {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900 border border-emerald-500/50 text-white px-5 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 animate-bounce">
      <div className="text-2xl">🏆</div>
      <div>
        <h4 className="font-bold text-sm text-emerald-400">Reward Claimed!</h4>
        <p className="text-xs text-slate-300 font-medium">
          +{toast.coins} Coins & +{toast.xp} XP added to your balance
        </p>
      </div>
      <button
        onClick={onClose}
        className="ml-3 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default RewardToast;