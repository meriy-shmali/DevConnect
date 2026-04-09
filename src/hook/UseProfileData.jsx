import { useQuery,useMutation } from "@tanstack/react-query";
import { getuserprofilereq, getuserpostsreq } from "../api/profilePageApi";
import { useQueryClient } from "@tanstack/react-query";
export const useGetProfile = (username) => {
  return useQuery({
    queryKey: ["profile", username],
   // queryFn: () => getuserprofilereq(username).then(res => res.data),
   // enabled: !!username,
     staleTime:Infinity,
     queryFn: async () => {
      // جلب البيانات من ملف الـ API
      const res = await getuserprofilereq(username);
      console.log("Data from API:", res.data); // تأكدي أن هذا السطر يطبع البيانات فعلاً
      return res.data;
    },
    // الحل السحري: إضافة بيانات أولية في حال لم تكتمل الـ Query بعد
    initialData: {
      id:'user_abc_123',
      username: username || "meriy_shmali",
      avatar: "",
      followersCount: 12,
      info: {
        specialization: "Informatics Engineering",
        bio: "Front-end Developer | React & Tailwind CSS",
        links: [{ label: "GitHub", url: "#" }]
      }
    } 
  });
};

export const useGetUserPosts = (username) => {
  return useQuery({
    queryKey: ["user-posts", username],
  //  queryFn: () => getuserpostsreq(username).then(res => res.data),
   // enabled: !!username,
   staleTime:Infinity,
     queryFn: async () => {
      // جلب البيانات من ملف الـ API
      const res = await getuserprofilereq(username);
      console.log("Data from API:", res.data); // تأكدي أن هذا السطر يطبع البيانات فعلاً
      return res.data;
    },
    // الحل السحري: إضافة بيانات أولية في حال لم تكتمل الـ Query بعد
    initialData: 
       [
      { id: 1, author: "Ritta7", content: "منشور تجريبي رقم 1", userAvatar: "https://via.placeholder.com/40" },
      { id: 2, author: "Ritta7", content: "منشور تجريبي رقم 2", userAvatar: "https://via.placeholder.com/40" }
    ]
    
  });
};
export const useUpdatePersonalInfo = (username) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData) => {
      // الرابط الذي جربتيه في بوستمان (تأكدي من المسار الصحيح)
      const response = await axios.patch(`/api/profile/${username}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      // لتحديث البيانات فوراً في الصفحة دون إعادة تحميل
      queryClient.invalidateQueries(['profile', username]);
    },
  });
};