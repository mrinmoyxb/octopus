import { sendDELETE, sendGET, sendPATCH, sendPOST } from "../core/http-client.js";
import { createSpinner, displayError, displayResponse } from "../utils/display.js";
import { saveRequestToLogs, saveResponseToLogs } from "./logs.js";

async function withTimer(requestFn){
    const start = Date.now();
    const response = await requestFn();
    response.duration = Date.now() - start;
    return response;
}

export async function getCommand(url, options){
    const spinner = createSpinner("GET", url);
    try{
        const uuid = await saveRequestToLogs({method: "GET", url, ...options})
        const response = await withTimer(() => sendGET(url, options));
        await saveResponseToLogs(uuid, response)
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
        const uuid = await saveRequestToLogs({method: "POST", url, ...options})
        const response = await withTimer(() => sendPOST(url, options));
        await saveResponseToLogs(uuid, response)
        spinner.succeed();
        displayResponse(response, "POST")
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1)
    }
}

export async function deleteCommand(url, options){
    const spinner = createSpinner("DELETE", url);
    try{
        const uuid = await saveRequestToLogs({method: "DELETE", url, ...options})
        const response = await withTimer(() => sendDELETE(url, options));
        await saveResponseToLogs(uuid, response)
        spinner.succeed();
        displayResponse(response, "DELETE")
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}

export async function patchCommand(url, options){
    const spinner = createSpinner("PATCH", url);
    try{
        const uuid = await saveRequestToLogs({method: "PATCH", url, ...options})
        const response = await withTimer(() => sendPATCH(url, options));
        await saveResponseToLogs(uuid, response)
        spinner.succeed();
        displayResponse(response, "PATCH");
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}

export async function putCommand(url, options){
    const spinner = createSpinner("PUT", url);
    try{
        const uuid = await saveRequestToLogs({method: "PUT", url, ...options})
        const response = await withTimer(() => sendPUT(url, options));
        await saveResponseToLogs(uuid, response)
        spinner.succeed();
        displayResponse(response, "PUT");
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}