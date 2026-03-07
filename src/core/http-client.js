import axios from "axios";

export async function sendGET(url, options = {}){
    const config = {
        headers: {},
        timeout: 10000
    }

    if(options.headers){
        options.headers.forEach(headerString => {
            const [key, ...rest] = headerString.split(":")
            config.headers[key.trim()] = rest.join(":").trim()
        })
    }

    if(options.token){
        config.headers["Authorization"] = `Bearer ${options.token}`
    }

    if(options.params){
        config.params = {}
        options.params.forEach(paramString => {
            const [key, value] = paramString.split("=")
            config.params[key.trim()] = value.trim()
        })
    }

    try{
        const response = await axios.get(url, config);
        return response;
    }catch(error){
        if(error.response){
            throw error
        }else if(error.request){
            throw new Error("No response from server. Check the URL or your internet.");
        }else{
            throw new Error(error.message)
        }
    }
}

export async function sendPOST(url, options = {}){
    const config = {
        headers: {},
        timeout: 10000
    }

    if(options.headers){
        options.headers.forEach(headerString=>{
            const [key, ...rest] = headerString.split(":");
            config.headers[key.trim()] = rest.join(":").trim()
        })
    }

    if(options.token){
        config.headers["Authorization"] = `Bearer ${options.token}`
    }

    let parsedBody = {}

    if(options.body){
        try{
            parsedBody = JSON.parse(options.body)
        }catch(error){
            throw new Error('Invalid JSON body. Use double quotes: {"example":"octopus"}');
        }
    }

    try{
        const response = await axios.post(url, parsedBody, config);
        return response;
    }catch(error){
        if(error.response){
            throw error
        }else if(error.request){
            throw new Error("No response from server. Check the URL or your internet.");
        }else{
            throw new Error(error.message)
        }
    }
}