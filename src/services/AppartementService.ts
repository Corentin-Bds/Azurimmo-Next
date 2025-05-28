import HttpService from "./HttpService";
import API_URL from "@/constants/ApiUrl";
import Appartement from "@/models/Appartement";

const AppartementService = {
    // Récupérer tous les appartements
    getAll: async (): Promise<Appartement[]> => {
        try {
            const response = await HttpService.get(API_URL.appartements);
            return Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Erreur lors de la récupération des appartements :", error);
            return [];
        }
    },

    // Récupérer un appartement par son ID
    getById: async (id: number): Promise<Appartement> => {
        return await HttpService.get(`${API_URL.appartements}${id}`);
    },

    // Récupérer les appartements d'un bâtiment
    getByBatimentId: async (batimentId: number): Promise<Appartement[]> => {
        return await HttpService.get(`${API_URL.appartementsByBatiment}${batimentId}`);
    },

    // Créer un appartement
    create: async (data: Omit<Appartement, "id">): Promise<Appartement> => {
        return await HttpService.post(API_URL.appartements, data);
    },

    // Modifier un appartement
    update: async (id: number, data: Appartement): Promise<Appartement> => {
        return await HttpService.put(`${API_URL.appartements}${id}`, data);
    },

    // Supprimer un appartement
    delete: async (id: number): Promise<boolean> => {
        return await HttpService.delete(`${API_URL.appartements}${id}`);
    }
};

export default AppartementService;