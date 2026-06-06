import { follow,unfollow } from "@/api/Follow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useFollow=()=>{
    const queryClient=useQueryClient();
     const followMutation= useMutation({
        mutationFn:follow,
        onSuccess:()=>{
["suggestion", "post", "profile"].forEach((key) => {
  queryClient.invalidateQueries({ queryKey: [key] });
});
        }
     })
    const unfollowMutation = useMutation({
    mutationFn: unfollow,
    onSuccess: () => {
    ["suggestion", "post", "profile"].forEach((key) => {
  queryClient.invalidateQueries({ queryKey: [key] });
});
    },
  });
  return { followMutation, unfollowMutation };
}