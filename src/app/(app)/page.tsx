"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"

function Home() {
  return (
    <>
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-xl md:text:2xl font-bold'>Jump in to the Anonymous Messages World</h1>
        <p>Explore Anonymous Message</p>
      </section>

      <Carousel
      plugins={[Autoplay({delay: 2000})]}
      className="w-full max-w-sm"
      >
      <CarouselContent>
        {
          messages.map((message, index) => (
            <CarouselItem key={index} >
              <Card className='h-50 py-4'>
                <CardHeader className='text-sm'>
                  {message.title}
                </CardHeader>
                <CardContent className="flex items-center justify-center mt-3">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>

    </main>
    <footer className='text-center p-4 md:p-6'>
        © 2025 Anonymous Message. All rights reserved.
    </footer>
    </>
  )
}

export default Home