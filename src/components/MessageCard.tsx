"use client"

import {format} from "date-fns"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}


function MessageCard({message, onMessageDelete}: MessageCardProps) {
    const handleDeleteConfirm = async() => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast(response.data.message)
        onMessageDelete(message._id as string)
    }
    return (
        <Card className="w-[350px] h-[150px] py-4 relative group">
            <CardHeader className="flex items-start justify-between mx-0">
                <CardTitle className="text-md">{message.content}</CardTitle>
                <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="lg:absolute lg:top-4 lg:right-4 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:z-10 ">< X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-400">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            </CardHeader>
            <CardFooter>
              <CardDescription>{format(new Date(message.createdAt), "MMMM dd, yyyy hh:mm a")}</CardDescription>
            </CardFooter>
        </Card>
    )
}



export default MessageCard