import { useEffect } from 'react';

interface UnlockedAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  reward_points: number;
}

interface Props {
  achievements: UnlockedAchievement[];
  onClose: () => void;
}

export default function AchievementToast({ achievements, onClose }: Props) {
  useEffect(() => {
    if (achievements.length > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievements, onClose]);

  if (achievements.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      maxWidth: 320,
    }}>
      {achievements.map((ach, idx) => (
        <div
          key={`${ach.id}-${idx}`}
          style={{
            background: 'linear-gradient(135deg, #fff9e6 0%, #ffe066 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '2px solid #ffd700',
            animation: 'slideIn 0.5s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 36 }}>{ach.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#333', marginBottom: 2 }}>
              🎉 成就解锁！
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>{ach.name}</div>
            <div style={{ fontSize: 12, color: '#777' }}>{ach.description}</div>
            <div style={{ fontSize: 12, color: '#d4a017', fontWeight: 600, marginTop: 4 }}>
              +{ach.reward_points} 积分
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
              color: '#999',
              padding: 4,
            }}
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
