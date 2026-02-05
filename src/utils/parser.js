export function parseHeaders(headerArray){
    const headers = {};

    if(headerArray && Array.isArray(headerArray)){
        headerArray.forEach(header=>{
            const [key, ...valueParts] = header.split(":");
            header[key.trim()] = valueParts.join(":").trim();
        });
    }

    return headers;
}

export function parseData(data){
    if(!data){
        return null;
    }

    try{
        return JSON.parse(data);
    }catch(error){
        return data;
    }
}