const express = require("express")
const app = express()
const PORT = 8123
const cron = require('node-cron') // SCHEDULER
require("dotenv").config()

const cors = require("cors")
app.use(cors({origin:'https://alicetoyou.vercel.app'}))
// app.use(cors({origin:'http://localhost:3000'}))

app.use(express.json())

// MAKING SCHEDULED TASK TO PROTECT SERVER FROM SLEEPING--------------------------

cron.schedule('*/14 * * * *', ()=>{
  fetch(process.env.SERVER_AWAKE_URL, {method: 'POST'}).then((r1)=>{
    console.log("server awake")
  })
})

// ------------------------------------------------------------------

app.post('/ai', async(req, res) => {
  // const {prmpt}=req.body
  const prompt=req.body.prompt
  console.log(prompt)
  const ansr = await run(prompt)
  console.log(typeof ansr)

  res.send(ansr)
  // res.send()
})

app.post('/wakeupserver', async(req, res)=>{
  res.send({message: "wake up to reality"})
  // res.send("wake up to reality")
  console.log("Waking server")
})




// THIS CODE IS USED TO GET TEXT OUTPUT FROM PROMPT TEXT

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);



async function run(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  // const prompt = "give me name of any five fruits"

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  // console.log(text);
  return text
}

// run();


// -------------------------------------------------------------------------------------------
// // THIS CODE IS TO GET TEXT OUTPUT FORM IMAGE + TEXT PROMPT
// // ABOVE IS ALSO CORRECT

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs");
// // const tst_img = require("./Images/bg1.jpg").catch((err)=>{
// //     console.log("error in declaring tst_img")
// //     console.log(err)
// // })
// // import tst_img from "./Images/bg1"

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

// // Converts local file information to a GoogleGenerativeAI.Part object.
// function fileToGenerativePart(path, mimeType) {
//   return {
//     inlineData: {
//       data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//       mimeType
//     },
//   };
// }

// async function run() {
//   // For text-and-image input (multimodal), use the gemini-pro-vision model
//   const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

//   const prompt = "name the anime character in the given image.";

//   const imageParts = [
//     // fileToGenerativePart("image1.png", "image/png"),
//     fileToGenerativePart("./Images/bg2.jpg", "image/jpeg"),
//   ];

//   const result = await model.generateContent([prompt, ...imageParts]);
//   const response = await result.response;
//   const text = response.text();
//   console.log(text);
// }

// run();



app.listen(PORT, () => {
  console.log("server activated at :" + PORT)
})