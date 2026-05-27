import { useEffect, useState } from 'react';
import { getCurrentProfileWithDetails } from '../api/profile';

export function useCurrentProfile() {
    const [currentProfile, setCurrentProfile] = useState(null);

    useEffect(() => {
        let active = true;

        async function loadProfile() {
            try {
                const current = await getCurrentProfileWithDetails();
                if (active) setCurrentProfile(current?.profile || null);
            } catch (err) {
                console.error('Failed to load current profile:', err);
            }
        }

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    return currentProfile;
}
