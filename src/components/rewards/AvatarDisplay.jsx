import { motion } from 'framer-motion';
import { useProfile } from '../../contexts/ProfileContext';
import { useRewards, getAvatarLevel } from '../../hooks/useRewards';

const SIZES = {
  sm: { container: 'w-8 h-8', text: 'text-lg', badge: 'w-4 h-4 text-[8px] -top-1 -right-1' },
  md: { container: 'w-12 h-12', text: 'text-2xl', badge: 'w-5 h-5 text-[10px] -top-1 -right-1' },
  lg: { container: 'w-20 h-20', text: 'text-4xl', badge: 'w-7 h-7 text-sm -top-1 -right-1' },
};

/**
 * Renders the child's avatar emoji with an overlay level badge.
 * At level 5 (200+ stars), a golden glow ring animates around the avatar.
 *
 * Props:
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 *   showBadge — whether to render the level badge (default true)
 */
export default function AvatarDisplay({ size = 'md', showBadge = true }) {
  const { profile } = useProfile();
  const { rewards } = useRewards();

  const totalStars = rewards?.totalStars || 0;
  const level = getAvatarLevel(totalStars);
  const sizeStyles = SIZES[size] || SIZES.md;
  const isLegend = level.level >= 5;

  return (
    <div className="relative inline-flex">
      {/* Golden glow ring for level 5 */}
      {isLegend && (
        <motion.div
          className={`absolute inset-0 rounded-full ${sizeStyles.container}`}
          style={{
            boxShadow: '0 0 12px 4px rgba(255, 217, 0, 0.5), 0 0 24px 8px rgba(255, 217, 0, 0.2)',
          }}
          animate={{
            boxShadow: [
              '0 0 12px 4px rgba(255, 217, 0, 0.5), 0 0 24px 8px rgba(255, 217, 0, 0.2)',
              '0 0 18px 6px rgba(255, 217, 0, 0.7), 0 0 32px 12px rgba(255, 217, 0, 0.3)',
              '0 0 12px 4px rgba(255, 217, 0, 0.5), 0 0 24px 8px rgba(255, 217, 0, 0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Avatar circle */}
      <div
        className={`${sizeStyles.container} rounded-full flex items-center justify-center ${sizeStyles.text} select-none`}
        style={{
          backgroundColor: '#1B2B32',
          border: isLegend ? '2px solid #FFD900' : '2px solid #2B3D45',
        }}
      >
        {profile?.avatarKey || '👤'}
      </div>

      {/* Badge */}
      {showBadge && level.badge && (
        <div
          className={`absolute ${sizeStyles.badge} rounded-full flex items-center justify-center font-display font-bold`}
          style={{
            backgroundColor: '#FF9600',
            border: '2px solid #131F24',
          }}
        >
          {level.badge}
        </div>
      )}
    </div>
  );
}
