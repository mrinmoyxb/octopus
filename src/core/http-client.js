import axios from "axios";
import { buildConfig, parseBody, handleAxiosError } from "../utils/parser";

export async function sendGET(url, options = {}){
    const config = buildConfig(options)
    try{
        const response = await axios.get(url, config);
        return response;
    }catch(error){
        handleAxiosError(error)
    }
}

export async function sendPOST(url, options = {}){
    const config = buildConfig(options);
    const body = parseBody(options.body);
    try{
        const response = await axios.post(url, body, config);
        return response;
    }catch(error){
        handleAxiosError(error)
    }
}