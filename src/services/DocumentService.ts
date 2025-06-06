import HttpService from "./HttpService";
import API_URL from "@/constants/ApiUrl";
import Document from "@/models/Document";

const DocumentService = {
    getAll: async (): Promise<Document[]> => {
        try {
            const response = await HttpService.get(API_URL.documents);
            return Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Erreur lors de la récupération des documents :", error);
            return [];
        }
    },

    getById: async (id: number): Promise<Document> => {
        return await HttpService.get(`${API_URL.documents}${id}`);
    },

    create: async (data: Omit<Document, "id">): Promise<Document> => {
        return await HttpService.post(API_URL.documents, data);
    },

    update: async (id: number, data: Document): Promise<Document> => {
        return await HttpService.put(`${API_URL.documents}${id}`, data);
    },

    delete: async (id: number): Promise<boolean> => {
        return await HttpService.delete(`${API_URL.documents}${id}`);
    }
};

export default DocumentService;
