interface Achievement {
  id: number;
  name: string;
  description: string;
  type: 'mileage' | 'activity';
  target: number;
  icon: string;
  reward_points: number;
  progress: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

interface Props {
  achievements: Achievement[];
}

export default function AchievementWall({ achievements }: Props) {
  const mileageAchievements = achievements.filter(a => a.type === 'mileage');
  const activityAchievements = achievements.filter(a => a.type === 'activity');

  function renderSection(title: string, list: Achievement[]) {
    if (list.length === 0) return null;

    return (
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 12, color: '#555' }}>{title}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {list.map(ach => {
            const percent = Math.min(100, (ach.progress / ach.target) * 100);
            return (
              <div
                key={ach.id}
                style={{
                  background: ach.unlocked ? 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)' : '#fafafa',
                  borderRadius: 12,
                  padding: 16,
                  border: `2px solid ${ach.unlocked ? '#ffd700' : '#e8e8e8'}`,
                  opacity: ach.unlocked ? 1 : 0.75,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8, textAlign: 'center' }}>
                  {ach.icon}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 10, textAlign: 'center', minHeight: 32 }}>
                  {ach.description}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{
                    width: '100%',
                    height: 8,
                    background: '#eee',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: ach.unlocked ? '#ffd700' : '#1a73e8',
                      borderRadius: 4,
                      transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#999', textAlign: 'center' }}>
                  {ach.type === 'mileage'
                    ? `${ach.progress.toFixed(1)} / ${ach.target} km`
                    : `${Math.floor(ach.progress)} / ${ach.target} 次`}
                </div>
                {ach.unlocked && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: '#d4a017',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}>
                    +{ach.reward_points} 积分
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (achievements.length === 0) {
    return <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>暂无成就数据</p>;
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      <div style={{ marginBottom: 20, padding: 12, background: '#f8f9fa', borderRadius: 8 }}>
        <span style={{ fontSize: 14, color: '#555' }}>
          已解锁 <strong style={{ color: '#1a73e8', fontSize: 18 }}>{unlockedCount}</strong> / {achievements.length} 个成就
        </span>
      </div>
      {renderSection('🏃 跑量里程碑', mileageAchievements)}
      {renderSection('🤝 活动参与', activityAchievements)}
    </div>
  );
}
