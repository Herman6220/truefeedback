'use client'

import { toast } from 'sonner'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'



function Page() {
   

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
        email: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
        const response = await axios.post<ApiResponse>("/api/forgot-password", data)
        toast("success", {
            description: response.data.message
        })
    } catch (error) {
        console.error("Error in password reset", error)
        const axiosError = error as AxiosError<ApiResponse>
        const errorMessage =  axiosError.response?.data.message
        toast("Password reset failed", {
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
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

export default Page