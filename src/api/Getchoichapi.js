import api from "./Api";
export const getchoichreq = async (category, pageParam = 1) => {
  const res = await api.get("/feed/", {
    params: {
      type: category === "all" ? undefined : category,
      page: pageParam,
    },
  });
  return res.data; 
};