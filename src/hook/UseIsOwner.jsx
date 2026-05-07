// src/hooks/useIsOwner.js
import { useParams } from "react-router-dom";

export const useIsOwner = (profileId) => {
  const { username } = useParams();
  const currentUserId = localStorage.getItem('userId');

  // إضافة console.log هنا ستكشف لكِ فوراً سبب الفشل في الكونسول
  // console.log("Checking Owner:", { username, currentUserId, profileId });

  if (username === 'me') return true;

  if (!currentUserId || !profileId) return false;

  return String(currentUserId) === String(profileId);
};