import axios from "axios";

export  default class HttpService{

    static async get(url:string){
        const response=await fetch(url);
        return await response.json();
    }

    static async put(url: string, data: any) {
        const response = await axios.put(url, data);
        return response.data;
    }
    
    static async post(url:string,data:any,headers?: any){
        const rHeaders={...headers,'Content-Type':'application/json'};
        const response=await fetch(url,{
            method:'POST',
            headers:rHeaders,
            body:JSON.stringify(data)});
        return await response.json();
    }

    static async delete(url: string) {
        const response = await fetch(url, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Erreur suppression (code " + response.status + ")");
        }

        return true;
    }
}