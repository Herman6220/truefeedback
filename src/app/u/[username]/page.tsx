'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { messageSchema } from '@/schemas/messageSchema'
import { useParams } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton'


function Page() {
  // const [text, setText] = useState("")

  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content
      })
      toast("Message sent successfully",{
        description: response.data.message
      })
    } catch (error) {
      console.log("Error occured while sending message", error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message
      toast("Error", {
        description: errorMessage || "Something went wrong while sending message"
      })
    }
  }


  const [content, setContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStream = async () => {
    setContent([]);
    setLoading(true);

    const response = await fetch('/api/suggest-messages', {
      method: 'POST'
    });
    if (!response.body) {
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    let lastQuestion = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('||');
        buffer = parts.pop() || '';
        for (const raw of parts) {
          const question = raw.trim();
          if (question !== lastQuestion && question.length > 3) {
            setContent((prev) => [...prev, question]);
            lastQuestion = question;
          }
        }
      }
    }
    if (buffer.trim()) {
      setContent((prev) => [...prev, buffer.trim()]);
    }
    setLoading(false);
    console.log(content);
  }





  // const handleClick = (param: string) => {
  //   setText(param);
  // }



  return (
    <div>
      <div className=" min-h-screen bg-gray-100 py-8 px-4">
        <div className='flex items-center justify-center p-4'>
          <h1 className='text-4xl font-bold'>Public Profile Link</h1>
        </div>
        <div className='flex items-center justify-center py-4 mt-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mx-2'>Send message to @{params.username}</FormLabel>
                    <FormControl>
                      <Textarea
                        // value={text}
                        placeholder="Your message"
                        className="resize-none"
                        // onChange={(e) => setText(e.target.value)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className='flex justify-center'>
                <Button type="submit">Send</Button>
              </span>
            </form>
          </Form>
        </div>
        <Separator />

        <div className='flex justify-center items-center my-4'>
          <Button onClick={() => handleStream()} type='submit'>Suggest Messages</Button>
        </div>
        <Card className="w-full p-2 gap-0">
          <CardHeader className='text-xl font-bold my-2'>Messages</CardHeader>
          <CardContent>
            <form>
              <div>
                {!loading ?
              (
              <div className="flex flex-col space-y-1.5 my-2 mb-6">
                {content.map((content, index) => (
                  <div key={index} className='flex justify-center items-center cursor-pointer border rounded-lg p-1 px-2' onClick={() => (form.setValue('content', `${content}`))}>{content}</div>
                ))}</div>
                ) : (
                  <div className="flex flex-col space-y-1.5 my-2 mb-6">
                  <Skeleton className="h-[33.5px]  rounded-md" />
                  <Skeleton className="h-[33.5px]  rounded-md" />
                  <Skeleton className="h-[33.5px]  rounded-md" />
                  </div>
              )
              }
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Page