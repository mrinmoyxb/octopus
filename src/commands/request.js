import { sendGET, sendPOST } from "../core/http-client.js";
import { createSpinner, displayError, displayResponse } from "../utils/display.js";

async function withTimer(requestFn){
    const start = Date.now();
    const response = await requestFn();
    response.duration = Date.now() - start;
    return response;
}

export async function getCommand(url, options){
    const spinner = createSpinner("GET", url);
    try{
        const response = await withTimer(() => sendGET(url, options));
        spinner.succeed();
        displayResponse(response, "GET");
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}

export async function postCommand(url, options){
    const spinner = createSpinner("POST", url);
    try{
        const response = await withTimer(() => sendPOST(url, options));
        spinner.succeed();
        displayResponse(response, "POST")
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1)
    }
}