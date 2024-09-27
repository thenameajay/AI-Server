const mongoose= require('mongoose')


const PromptSchema= new mongoose.Schema({
    prompt:{
        type:String,
        required:true,
    }
})

const PROMPT = mongoose.model("prompt", PromptSchema)
module.exports=PROMPT