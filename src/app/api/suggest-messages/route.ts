
import axios from 'axios';


export async function POST(){

  try {
    const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama3-70b-8192',
      messages: [{ role: "user", content: "Generate exactly three one-line, open-ended questions on any topic, separated by double vertical bars (||) and question marks at the end (?). Do not include any greetings, explanations, or additional text—only the three questions."}],
      stream: true
    },
    {
      
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
    }
  )


    const stream = new ReadableStream({
      async start(controller){
        let buffer = '';
        groqResponse.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for(const line of lines){
          if(line.startsWith('data:')){
            const dataStr = line.slice(6).trim();
            if(dataStr === "[DONE]"){
              return;
            }
            try {
              const json = JSON.parse(dataStr)
              const content = json.choices?.[0]?.delta?.content;
              console.log(content)
              if(content){
                 controller.enqueue(new TextEncoder().encode(content));
              }
            } catch (error) {
              console.log("Error parsing json", error);
            }
          }
        }
        });
        groqResponse.data.on('end', () => {
          controller.close();
        })
        groqResponse.data.on('error', (err: Error) => {
          controller.error(err)
        })
      }
    })

    return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });




  } catch (error) {
     console.log("Error getting AiResponses", error)
        return Response.json(
                {
                    success: false,
                    message: "Internal server error"
                },{status: 500}
            )
  }
}
