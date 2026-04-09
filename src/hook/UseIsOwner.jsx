// src/hooks/useIsOwner.js
export const useIsOwner = (profileId) => {
  // جلب آيدي المستخدم المسجل من localStorage
  const currentUserId = localStorage.getItem('userId');

  // المقارنة (نحولهم لنصوص لضمان الدقة)
  const isOwner = String(currentUserId) === String(profileId);

  return isOwner;
};