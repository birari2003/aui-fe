import React from 'react';
import { User } from 'lucide-react';
import { BASE_URL } from '../utils/urls';

interface TalentAvatarProps {
  talentCode: string;
  initialAvatarUrl?: string;
  className?: string;
  iconSize?: number;
  placeholderClassName?: string;
}

export const TalentAvatar: React.FC<TalentAvatarProps> = ({ 
  talentCode, 
  initialAvatarUrl, 
  className, 
  iconSize = 32,
  placeholderClassName
}) => {
  const [avatar, setAvatar] = React.useState<string>(initialAvatarUrl || '');

  React.useEffect(() => {
    if (initialAvatarUrl) {
      setAvatar(initialAvatarUrl);
      return;
    }

    if (!talentCode) {
      setAvatar('');
      return;
    }

    let isMounted = true;
    
    // Fetch from public profile
    fetch(`${BASE_URL}/api/public-profile/code/${talentCode}`)
      .then(res => res.json())
      .then(payload => {
        if (isMounted && payload?.ok && payload?.data?.publicProfile?.profileImage) {
          const profileImg = payload.data.publicProfile.profileImage;
          const fullUrl = profileImg.startsWith('http') ? profileImg : `${BASE_URL}/${profileImg.replace(/\\/g, '/')}`;
          setAvatar(fullUrl);
        }
      })
      .catch(err => console.error('Error fetching public profile avatar:', err));

    return () => {
      isMounted = false;
    };
  }, [talentCode, initialAvatarUrl]);

  if (avatar) {
    return (
      <img
        src={avatar}
        alt="Avatar"
        className={className}
      />
    );
  }

  return (
    <div className={`${className} ${placeholderClassName || 'bg-gray-100 text-gray-400 border border-gray-200'} flex items-center justify-center`}>
      <User size={iconSize} />
    </div>
  );
};

export default TalentAvatar;
