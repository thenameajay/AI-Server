import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv()
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

// Documentation Example-------------------
// // Define the function declaration for the model
// const scheduleMeetingFunctionDeclaration = {
//     name: 'schedule_meeting',
//     description: 'Schedules a meeting with specified attendees at a given time and date.',
//     parameters: {
//         type: 'OBJECT',
//         properties: {
//             attendees: {
//                 type: 'Array',
//                 items: { type: 'STRING' },
//                 description: 'List of people attending the meeting.',
//             },
//             date: {
//                 type: 'STRING',
//                 description: 'Date of the meeting (e.g., "2024-07-29")',
//             },
//             time: {
//                 type: 'STRING',
//                 description: 'Time of the meeting (e.g., "15:00")',
//             },
//             topic: {
//                 type: 'STRING',
//                 description: 'The subject or topic of the meeting.',
//             },
//         },
//         required: ['attendees', 'date', 'time', 'topic'],
//     },
// };
// Documentation Example-------------------

const tellCurrentTimeFunctionDeclaration = {
    name: 'tellCurrentTime',
    description: 'Tells the current time in UTC format',
    // parameters: {
    //     type: 'OBJECT',
    //     properties: {
    //         attendees: {
    //             type: 'Array',
    //             items: { type: 'STRING' },
    //             description: 'List of people attending the meeting.',
    //         },
    //         date: {
    //             type: 'STRING',
    //             description: 'Date of the meeting (e.g., "2024-07-29")',
    //         },
    //         time: {
    //             type: 'STRING',
    //             description: 'Time of the meeting (e.g., "15:00")',
    //         },
    //         topic: {
    //             type: 'STRING',
    //             description: 'The subject or topic of the meeting.',
    //         },
    //     },
    //     required: ['attendees', 'date', 'time', 'topic'],
    // },
};


function tellCurrentTime() {
    return new Date()
}

const getAiResponse = async (chatHistory) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: chatHistory,
        // config: {
        //     tools: [{
        //         // Documentation Example-----
        //         // functionDeclarations: [scheduleMeetingFunctionDeclaration]
        //         // Documentation Example-----

        //         functionDeclarations: [tellCurrentTimeFunctionDeclaration]
        //     }],
        // },
    });

    return response
}

export async function askAI(chatHistory) {
    try {
        // const response = await ai.models.generateContent({
        //     model: "gemini-2.0-flash",
        //     contents: chatHistory,
        //     config: {
        //         tools: [{
        //             // Documentation Example-----
        //             // functionDeclarations: [scheduleMeetingFunctionDeclaration]
        //             // Documentation Example-----

        //             functionDeclarations: [tellCurrentTimeFunctionDeclaration]
        //         }],
        //     },
        // });

        let response = await getAiResponse(chatHistory)

        // // Check for function calls in the response
        if (response.functionCalls && response.functionCalls.length > 0) {
            const functionCall = response.functionCalls[0]; // Assuming one function call
            console.log("Tell current time function is called by AI !")
            // In a real app, you would call your actual function here:
            const result = tellCurrentTime();


            // Create a function response part
            const function_response_part = {
                name: functionCall.name,
                response: { result }
            }
            const contents = chatHistory
            // Append function call and result of the function execution to contents
            contents.push(response.candidates[0].content);
            contents.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });

            response = await getAiResponse(contents)

        } else {
            console.log("No function call found in the response.");
            console.log(response.text);
        }



        // Documentation Example---------
        // // // Check for function calls in the response
        // if (response.functionCalls && response.functionCalls.length > 0) {
        //     const functionCall = response.functionCalls[0]; // Assuming one function call
        //     console.log(`Function to call: ${functionCall.name}`);
        //     console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
        //     // In a real app, you would call your actual function here:
        //     // const result = await scheduleMeeting(functionCall.args);
        // } else {
        //     console.log("No function call found in the response.");
        //     console.log(response.text);
        // } 
        // Documentation Example---------



        const reply = response.text
        return reply;
    } catch (error) {
        console.log(error)
        return "Error in generating content !"
    }
}



// const arr = [
//     { role: "you", text: "hello" },
//     { role: "me", text: "hi how are you" },
//     { role: "you", text: "how should I help you" },
//     { role: "me", text: "tell me a joke" }
// ];

// Map to Gemini's format
// const chatHistory = arr.map(item => ({
//     role: item.role === "me" ? "user" : "model", // Gemini expects "user" and "model"
//     parts: [{ text: item.text }]
// }));

// async function run() {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const result = await model.generateContent({ contents: chatHistory });
//     const response = await result.response;
//     console.log(response.text());
//   }