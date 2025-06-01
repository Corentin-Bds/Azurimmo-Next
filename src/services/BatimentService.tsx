import HttpService from "./HttpService";
import API_URL from "@/constants/ApiUrl";
import Batiment from "@/models/Batiment";

const BatimentService = {
    // Récupérer tous les bâtiments
    getAll: async (): Promise<Batiment[]> => {
        try {
            const response = await HttpService.get(API_URL.batiments);
            return Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Erreur lors de la récupération des bâtiments :", error);
            return [];
        }
    },

    // Récupérer un bâtiment par son ID
    getById: async (id: number): Promise<Batiment> => {
        return await HttpService.get(`${API_URL.batiments}id/${id}`);
    },

    // Créer un bâtiment
    create: async (data: Omit<Batiment, "id">): Promise<Batiment> => {
        return await HttpService.post(API_URL.batiments, data);
    },

    // Modifier un bâtiment
    update: async (id: number, data: Batiment): Promise<Batiment> => {
        return await HttpService.put(`${API_URL.batiments}${id}`, data);
    },

    // Supprimer un bâtiment
    delete: async (id: number): Promise<boolean> => {
        return await HttpService.delete(`${API_URL.batiments}${id}`);
    }
};

export default BatimentService;