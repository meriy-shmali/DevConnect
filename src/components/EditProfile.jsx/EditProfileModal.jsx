import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X ,Sparkles} from 'lucide-react';
import { editProfileSchema } from '../Schema/EditProfileSchema';
import { useUpdateProfileMutation } from '@/hook/useUpdateProfileMutation';
import { useQuery } from '@tanstack/react-query';
import { getprofilereq } from '../api/ProfileApi'; // استدعاء الدالة بنمط الـ req
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';

const EditProfileModal = ({ isOpen, onClose }) => {
  // 1. جلب البيانات الحالية للمستخدم (القادمة من السيرفر)
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: getprofilereq,
    enabled: isOpen, // يتم الجلب فقط عند فتح المودال
  });

  // 2. استدعاء الميوتيشن الخاص بالتحديث
  const { mutate, isPending } = useUpdateProfileMutation();

  // 3. إعداد الفورم مع القيم الافتراضية
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      major: "",
      bio: "",
      links: "",
    },
  });

  // 4. تحديث الحقول فور وصول البيانات من السيرفر (Reset Form)
  useEffect(() => {
    if (profileResponse?.data) {
      const user = profileResponse.data;
      form.reset({
        major: user.major || "",
        bio: user.bio || "",
        links: user.links || "",
      });
    }
  }, [profileResponse, form]);

  if (!isOpen) return null;

  // 5. دالة الإرسال عند الضغط على Save
  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {
        onClose(); // إغلاق المودال عند النجاح
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-[500px] rounded-[25px] shadow-2xl relative overflow-hidden transition-all">
        
        {/* زر الإغلاق الأحمر المميز (Figma style) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-red-500 hover:scale-110 transition-transform z-10"
        >
          <X size={26} strokeWidth={3} />
        </button>

        <div className="p-8">
          <h2 className="text-left text-[22px] font-bold text-[#1a1a40] mb-10 capitalize">
            edit personal information
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-10 text-gray-400 font-medium">Loading data...</div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* حقل التخصص - Major */}
                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 space-y-0">
                      <FormLabel className="text-[18px] font-bold text-gray-700 min-w-[70px]">Major:</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <input 
                            {...field} 
                            placeholder="Your major..."
                            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-[16px] transition-colors bg-transparent" 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* حقل السيرة الذاتية - Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                   <FormItem className="flex items-center gap-4 space-y-0">
                      <FormLabel className="text-[18px] font-bold text-gray-700 min-w-[70px]">Bio:</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <input 
                            {...field} 
                            placeholder="A short bio..."
                            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-[16px] transition-colors bg-transparent" 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* حقل الروابط - Links */}
                <FormField
                  control={form.control}
                  name="links"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4 space-y-0">
                      <FormLabel className="text-[18px] font-bold text-gray-700 min-w-[70px]">Links:</FormLabel>
                      <div className="flex-1">
                        <FormControl>
                          <input 
                            {...field} 
                            placeholder="Website or social link..."
                            className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-[16px] transition-colors bg-transparent" 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* زر الحفظ الصغير (Figma style) */}
                <div className="flex justify-center pt-4">
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="bg-[#2d43a6] text-white px-8 py-1.5 rounded-md text-sm font-bold shadow-md hover:bg-[#1e2d7a] active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isPending ? "Saving..." : "save"}
                  </button>
                </div>

              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;