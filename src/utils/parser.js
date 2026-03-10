export function buildConfig(options = {}){
    const config = {
        headers: {},
        timeout: 10000
    }

    if(options.headers && Array.isArray(options.headers)){
        options.headers.forEeach((headerString)=>{
            const [key, ...rest] = headerString.split(":");
            config.headers[key.trim()] = rest.join(":").trim();
        })
    }

    if(options.token){
        config.headers["Authorization"] = `Bearer: ${options.token}`
    }

    if(options.params && Array.isArray(options.headers)){
        config.params = {}
        options.params.forEeach((paramString)=>{
            const [key, value] = paramString.split("=");
            config.params[key.trim()] = value.trim()
        })
    }

    return config;
}

export function parseBody(bodyString){
    if(!bodyString) return {}
    try{
        return JSON.parse(bodyString);
    }catch{
        throw new Error(`Invalid JSON body: ${bodyString}\n Tip: use double quotes inside -> {"name":"john"}`)
    }
}

export function handleAxiosError(error) {
  if (error.response) {
    throw error
  } else if (error.request) {
    throw new Error("No response from server. Check the URL or your internet.")
  } else {
    throw new Error(error.message)
  }
}

export function resolveVariables(text, variables){
    if(!text){
        return text;
    }

    return text.replace(/\{\{(\w+)\}\}/g, (match, key)=>{
        if(variables[key] !== undefined){
            return variables[key];
        }

        console.warn(`  ⚠️ Warning: {{${key}}} not found in active environment`)
        return match
    })
}