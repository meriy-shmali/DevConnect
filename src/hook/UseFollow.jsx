import { follow,unfollow } from "@/api/Follow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useFollow=()=>{
    const queryClient=useQueryClient();
     const followMutation= useMutation({
        mutationFn:follow,
        onSuccess:()=>{
queryClient.invalidateQueries({
  queryKey:["suggestion"]
});
queryClient.invalidateQueries({
  queryKey:["post"]
});
queryClient.invalidateQueries({
  queryKey:["profile"]
});
queryClient.invalidateQueries({
  queryKey:["followers"]
});
queryClient.invalidateQueries({
  queryKey:["following"]
});
        }
     })
    const unfollowMutation = useMutation({
    mutationFn: unfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({
  queryKey:["suggestion"]
});
queryClient.invalidateQueries({
  queryKey:["post"]
});
queryClient.invalidateQueries({
  queryKey:["profile"]
});
queryClient.invalidateQueries({
  queryKey:["followers"]
});
queryClient.invalidateQueries({
  queryKey:["following"]
});
    },
  });
  return{unfollowMutation,followMutation}
}