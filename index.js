import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let API_URL = "https://v2.jokeapi.dev/joke/";
let UPDATED_URL = "";

app.get("/", async (req, res)=>{
    res.render("index.ejs");
});

app.post("/getajoke", async (req, res)=>{
    const category = req.body.category;
    let blacklistedflags = req.body.blacklistedflags;
    const type = req.body.type;
    if(category){
        UPDATED_URL = API_URL+category;
        if(blacklistedflags){
            blacklistedflags = Array(blacklistedflags);
            UPDATED_URL = UPDATED_URL+"?blacklistFlags="+blacklistedflags.join();
            if(type){
                UPDATED_URL = UPDATED_URL+"&type="+type;
            }
        }else if(type){
            UPDATED_URL = UPDATED_URL+"?type="+type;
        }
    }else{
        UPDATED_URL = API_URL+"Any";
        if(blacklistedflags){
            blacklistedflags = Array(blacklistedflags);
            UPDATED_URL = UPDATED_URL+"?blacklistFlags="+blacklistedflags.join();
            if(type){
                UPDATED_URL = UPDATED_URL+"&type="+type;
            }
        }else if(type){
            UPDATED_URL = UPDATED_URL+"?type="+type;
        }
    }
    try{
        const result = await axios.get(UPDATED_URL);
        const content = result.data;
        UPDATED_URL = API_URL;
        res.render("joke.ejs", {content: content});
    }catch(error){
        console.error("Not able to fetch the data", error)
    }
    
});

app.listen(port, ()=>{
    console.log("Server is running on http://localhost:"+port);
});