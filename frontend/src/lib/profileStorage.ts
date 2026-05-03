const PROFILE_KEY = "helix_profile_v1";

export type StoredProfile = {
  linkedUsername: string;
  displayName: string;
};

export function loadProfile(sessionUsername: string): StoredProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      return { linkedUsername: sessionUsername, displayName: sessionUsername };
    }
    const p = JSON.parse(raw) as Partial<StoredProfile>;
    if (p.linkedUsername === sessionUsername && typeof p.displayName === "string") {
      return {
        linkedUsername: sessionUsername,
        displayName: p.displayName.trim() || sessionUsername,
      };
    }
  } catch {
    /* ignore */
  }
  return { linkedUsername: sessionUsername, displayName: sessionUsername };
}

export function saveProfile(sessionUsername: string, displayName: string) {
  const next: StoredProfile = {
    linkedUsername: sessionUsername,
    displayName: displayName.trim() || sessionUsername,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
}
