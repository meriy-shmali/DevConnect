// src/api/ProfilePageApi.jsx
import axios from "axios";

export const getuserprofilereq = async (username) => {
  return Promise.resolve({
    data: {
      id:'user_abc_123',
      username: username || "meriy_shmali",
      avatar: "",
      followersCount: 12,
      info: {
        id:'user_abc_123',
        specialization: "",
        bio: "",
        links:""
      }
    }
  });
};

export const getuserpostsreq = async (username) => {
  return Promise.resolve({
    data: [
      { id: 1, author: "Ritta7", content: "منشور تجريبي رقم 1", userAvatar: "https://via.placeholder.com/40" },
      { id: 2, author: "Ritta7", content: "منشور تجريبي رقم 2", userAvatar: "https://via.placeholder.com/40" }
    ]
  });
};