import { sendDELETE, sendGET, sendPATCH, sendPOST, sendPUT } from "../core/http-client.js";
import { createSpinner, displayError, displayResponse } from "../utils/display.js";
import { saveRequestToLogs, saveResponseToLogs } from "./logs.js";
import { resolveVariables } from "../utils/parser.js";
import { getActiveVariables } from "./env.js";

async function withTimer(requestFn){
    const start = Date.now();
    const response = await requestFn();
    response.duration = Date.now() - start;
    return response;
}

export async function getCommand(url, options){
    const variables = await getActiveVariables();
    const resolvedURL = resolveVariables(url, variables);
    if(options.token) options.token = resolveVariables(options.token, variables);

    const spinner = createSpinner("GET", resolvedURL);
    try{
        const uuid = await saveRequestToLogs({method: "GET", url: resolvedURL, ...options})
        const response = await withTimer(() => sendGET(resolvedURL, options));
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
     const variables = await getActiveVariables();
    const resolvedURL = resolveVariables(url, variables);
    if(options.token) options.token = resolveVariables(options.token, variables);

    const spinner = createSpinner("POST", resolvedURL);
    try{
        const uuid = await saveRequestToLogs({method: "POST", url: resolvedURL, ...options})
        const response = await withTimer(() => sendPOST(resolvedURL, options));
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
    const variables = await getActiveVariables();
    const resolvedURL = resolveVariables(url, variables);
    if(options.token) options.token = resolveVariables(options.token, variables);

    const spinner = createSpinner("DELETE", resolvedURL);
    try{
        const uuid = await saveRequestToLogs({method: "DELETE", url: resolvedURL, ...options})
        const response = await withTimer(() => sendDELETE(resolvedURL, options));
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
    const variables = await getActiveVariables();
    const resolvedURL = resolveVariables(url, variables);
    if(options.token) options.token = resolveVariables(options.token, variables);

    const spinner = createSpinner("PATCH", resolvedURL);
    try{
        const uuid = await saveRequestToLogs({method: "PATCH", url: resolvedURL, ...options})
        const response = await withTimer(() => sendPATCH(resolvedURL, options));
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
    const variables = await getActiveVariables();
    const resolvedURL = resolveVariables(url, variables);
    if(options.token) options.token = resolveVariables(options.token, variables);

    const spinner = createSpinner("PUT", resolvedURL);
    try{
        const uuid = await saveRequestToLogs({method: "PUT", url: resolvedURL, ...options})
        const response = await withTimer(() => sendPUT(resolvedURL, options));
        await saveResponseToLogs(uuid, response)
        spinner.succeed();
        displayResponse(response, "PUT");
    }catch(error){
        spinner.fail();
        displayError(error);
        process.exit(1);
    }
}