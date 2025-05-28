'use client'

import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";



export default function ResetPasswordForm(){
const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: ""
        }
    })

    // const params = useParams<{token: string}>()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    
    
    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        try {
            const response = await axios.post<ApiResponse>("/api/reset-password",{
                token,
                newPassword: data.newPassword
            })

            toast("Success",{
                description: response.data.message
            })
        } catch (error) {
            console.log("Error in resetting password", error)
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast("Password reset process failed", {
                description: errorMessage
            })
        }
    }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div>
                <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="new password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="confirm new password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <Button type="submit" >
          Submit
        </Button> 

          </form>
        </Form>
            </div>
        </div>
    </div>
  )
}