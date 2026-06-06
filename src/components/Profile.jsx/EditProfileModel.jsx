import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { X, Loader2 } from 'lucide-react';
import { useUpdatePersonalInfo } from '@/hook-temp/UseProfileData';
import { zodResolver } from '@hookform/resolvers/zod';
import { editProfileSchema } from '../Schema/EditProfileSchema';
import { Input } from '../ui/input';
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";

const EditProfileModal = ({ isOpen, onClose, initialData }) => {
  const { t } = useTranslation();
  
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      specialization: "",
      bio: "",
      links: ""
    }
  });

  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        specialization: initialData.specialization || "",
        bio: initialData.bio || "",
        links: initialData.links || "",
      });
    }
  }, [initialData, form, isOpen]);

  const { mutate: updateProfile, isPending } = useUpdatePersonalInfo();
  
  const onSubmit = (formData) => {
    updateProfile(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[15px] w-full max-w-lg md:max-w-2xl lg:max-w-3xl relative shadow-2xl border border-gray-100 p-7 z-10 dark:bg-dark-post-background top-5 cursor-default"
      >
        <button onClick={onClose} className="absolute top-4 end-4 p-2 z-10 hover:bg-gray-50 rounded-full transition-colors">
          <X className="w-6 h-6 text-red-500 text-xl font-light hover:text-red-700" />
        </button>
      
        <h3 className="text-center font-bold md:mb-10 mb-8 md:text-3xl text-xl mt-3 dark:text-gray-50">
          {t('edit_personal_info')}
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            
            {/* حقل Specialization */}
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                // 🎯 أضفنا md:gap-x-6 للتحكم بالمسافة بين الكلمة والحقل مباشرة
                <FormItem className="space-y-1 md:space-y-0 flex flex-col md:flex-row md:items-center md:gap-x-6">
                  {/* 🎯 قمنا بإزالة w-full وتحديد عرض ثابت md:w-36 ومحاذاة النص للبدء md:text-start */}
                  <FormLabel className="text-main-text md:text-2xl text-lg font-medium text-black dark:text-gray-50 md:w-36 shrink-0 md:text-start">
                    {t('specialization')}:
                  </FormLabel>
                  <div className='flex flex-col w-full flex-1 max-w-[500px]'>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="md:text-lg text-sm dark:text-dark-text whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide group bg-white border-black border w-full px-3 h-fit mb-1 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20" 
                      />
                    </FormControl>
                    <FormMessage className="text-left md:text-[18px] text-[18px]" />
                  </div>
                </FormItem>
              )}
            />

            {/* حقل Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="space-y-1 md:space-y-0 flex flex-col md:flex-row md:items-center md:gap-x-6">
                  <FormLabel className="text-main-text md:text-2xl text-lg font-medium text-black dark:text-gray-50 md:w-36 shrink-0 md:text-start">
                    {t('bio')}:
                  </FormLabel>
                  <div className='flex flex-col w-full flex-1 max-w-[500px]'>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="md:text-lg text-sm dark:text-dark-text whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide group bg-white border-black border w-full px-3 h-fit mb-1 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20" 
                      />
                    </FormControl>
                    <FormMessage className="text-left md:text-[18px] text-[18px]" />
                  </div>
                </FormItem>
              )}
            />

            {/* حقل Links */}
            <FormField
              control={form.control}
              name="links"
              render={({ field }) => (
                <FormItem className="space-y-1 md:space-y-0 flex flex-col md:flex-row md:items-center md:gap-x-6">
                  <FormLabel className="text-main-text md:text-2xl text-lg font-medium text-black dark:text-gray-50 md:w-36 shrink-0 md:text-start">
                    {t('links')}:
                  </FormLabel>
                  <div className='flex flex-col w-full flex-1 max-w-[500px]'>
                    <FormControl>
                      <Input 
                        placeholder="" 
                        {...field} 
                        className="md:text-lg text-sm dark:text-dark-text whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide group bg-white border-black border w-full px-3 h-fit mb-1 focus-within:ring-1 focus-within:ring-blue-button focus-within:border-blue-button transition-all focus-within:outline-none dark:bg-dark-post-background dark:border-white/20" 
                      />
                    </FormControl>
                    <FormMessage className="md:text-[18px] text-[18px]" />
                  </div>
                </FormItem>
              )}
            />

            {/* زر الحفظ */}
            <div className="flex justify-center pt-3">
              <button 
                type="submit" 
                disabled={isPending}
                className="bg-blue-button hover:bg-hover-blue text-text-button md:text-lg px-4 py-1.5 rounded-md text-md transition-all shadow hover:shadow-lg flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('saving')}
                  </>
                ) : t('save')}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditProfileModal;