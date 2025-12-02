import React from 'react'
import{z}from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import registerschema from '../Schema/RegisterSchema';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form, FormField, FormItem, FormLabel,
  FormControl, FormMessage
} from "@/components/ui/form";
import { MailIcon ,LockIcon, User, PhoneCall, Phone } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import Buttons from '../ui/ButtonGroup';
import { fi } from 'zod/v4/locales';

const RegisterForm = () => {
    const form = useForm({
    resolver: zodResolver(registerschema),
    defaultValues: {
     firstname:"",
     lastname:"",
      email: "",
      password: "",
      confirmpassword:"",
      phone:"",
      age:"",
      gender:"",
      username:"",
    },
    
  });
  const navigate=useNavigate();
    const onSubmit = async (data) => {

    navigate("/feed");
  };
  const { t } = useTranslation();
  return (
    <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
    <FormField
      control={form.control}
      name="firstname"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('firstname')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="firstname"
                placeholder="first name"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="lastname"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('lastname')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="lastname"
                placeholder="last name"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('username')}</FormLabel>
          <FormControl>
            
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="username"
                placeholder="username"
                className="placeholder:text-[22px] mt-2"
              />
              <InputGroupAddon>
                <User className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[30px] md:text-[48px]">{t('email')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="email"
                placeholder="example@mail.com"
                className="placeholder:text-[22px] mt-1"
              />
              <InputGroupAddon>
                <MailIcon className='size-6'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-[30px] md:text-[48px]">{t('password')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="password"
                placeholder="•••••••"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
                <LockIcon className='size-6'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="confirmpassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-[30px] md:text-[48px]">{t('confirm_password')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="confirmpassword"
                placeholder="•••••••"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
                <LockIcon className='size-6'/>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
          <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-[30px] md:text-[48px]">{t('age')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="age"
                placeholder=""
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />   
     <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-[30px] md:text-[48px]">{t('gender')}</FormLabel>
          <FormControl>
            <div className='ml-2'>
           <RadioGroup defaultValue="male">
  <div className="flex items-center space-x-2 ">
    <RadioGroupItem value="male" id="male" />
    <Label htmlFor="male" className='text-gray-500 text-[20px]'>{t('male')}</Label>
  </div>
  <div className="flex items-center space-x-2 ">
    <RadioGroupItem value="female" id="female" />
    <Label htmlFor="female" className='text-gray-500 text-[20px]'>{t('female')}</Label>
  </div>
</RadioGroup> </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />  
    
       
            
  <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel className=" text-[30px] md:text-[48px]">{t('phone_number')}</FormLabel>
          <FormControl>
            <InputGroup className="bg-light-placeholder w-[500px] h-[46px]">
              <InputGroupInput
                {...field}
                type="phone"
                placeholder="phone"
                className="placeholder:text-[22px] mt-3"
              />
              <InputGroupAddon>
             <Phone className='size-6' />
              </InputGroupAddon>
            </InputGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />  
<div className='flex justify-center p-4'><Buttons type="login"/></div> 

  </form>
</Form>

  )
}

export default RegisterForm