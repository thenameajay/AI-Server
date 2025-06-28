import { askAI } from "../AITools/TextGeneration.js";

export const ListenToConversations = (io) => {
    try {
        io.on('connection', async (socket) => {
            console.log('A user connected:', socket.id);

            listenToMessages(socket)

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        });
    } catch (error) {
        console.log("Error in socket connection: ", error)
    }
}

const listenToMessages = async (socket) => {
    try {
        const conversationHistory = []
        socket.on('message', async (msg) => {
            try {
                console.log('Message received:', msg);
                const formattedMsg = {
                    role: "user",
                    parts: [{ text: msg }]
                }
                conversationHistory.push(formattedMsg);

                const reply = await sendNewMessage(socket, conversationHistory); // send to the sender
                console.log("ai reply: ", reply)
                const formattedReply = {
                    role: "model",
                    parts: [{ text: reply }]
                }
                conversationHistory.push(formattedReply)
            } catch (err) {
                console.log("Error inside socket event listening: ", err)
            }
        });
    } catch (error) {
        console.log("Error in Listening to Messages fuction: ", error)
    }
}

const sendNewMessage = async (socket, conversation) => {
    try {
        // const reply = "hello there !"
        const reply = await askAI(conversation)
        await socket.emit('message', reply); // send to the sender
        return reply
    } catch (error) {
        console.log("An error occured when sending reply: ", error)
    }
}