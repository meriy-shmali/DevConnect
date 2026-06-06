import { useMutation, useQueryClient } from '@tanstack/react-query';
import {updateProfilereq, deleteProfilePhotoReq } from '@/api/ProfilePageApi'; 
import { toast } from 'react-hot-toast';
import i18n from 'i18next'; 

export const useUpdateProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfilereq, 
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(i18n.t('photo_updated_success'));
    },
    onError: () => {
      toast.error(i18n.t('photo_updated_failed'));
    }
  });
};
export const useDeleteProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProfilePhotoReq,
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(i18n.t('photo_deleted_success'));
    },
    onError: () => {
      toast.error(i18n.t('photo_deleted_failed'));
    }
  });
};