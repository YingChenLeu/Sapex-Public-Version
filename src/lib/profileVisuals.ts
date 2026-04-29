export function resolveUserAvatarUrl(userData: any): string | null {
  if (!userData || typeof userData !== "object") return null;
  const picture = userData.profilePicture;
  if (typeof picture !== "string") return null;
  const trimmed = picture.trim();
  return trimmed || null;
}

