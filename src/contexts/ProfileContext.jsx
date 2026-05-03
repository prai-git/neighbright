import { createContext, useContext, useState, useEffect } from 'react';
import db from '../db';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.profile.toCollection().first().then((p) => {
      setProfile(p || null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const saveProfile = async (profileData) => {
    if (profile?.id) {
      await db.profile.update(profile.id, profileData);
      setProfile({ ...profile, ...profileData });
    } else {
      const id = await db.profile.add({ ...profileData, createdAt: new Date().toISOString() });
      setProfile({ ...profileData, id, createdAt: new Date().toISOString() });
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
}
