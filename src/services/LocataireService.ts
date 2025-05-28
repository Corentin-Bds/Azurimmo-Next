import HttpService from "./HttpService";
import API_URL from "@/constants/ApiUrl";
import Locataire from "@/models/Locataire";

const LocataireService = {
    // Récupérer tous les locataires
    getAll: async (): Promise<Locataire[]> => {
        return await HttpService.get(API_URL.locataires);
    },

    // Récupérer un locataire par son ID
    getById: async (id: number): Promise<Locataire> => {
        return await HttpService.get(`${API_URL.locataires}${id}`);
    },

    // Créer un locataire
    create: async (data: Omit<Locataire, "id">): Promise<Locataire> => {
        return await HttpService.post(API_URL.locataires, data);
    },

    // Modifier un locataire
    update: async (id: number, data: Locataire): Promise<Locataire> => {
        return await HttpService.put(`${API_URL.locataires}${id}`, data);
    },

    // Supprimer un locataire
    delete: async (id: number): Promise<boolean> => {
        return await HttpService.delete(`${API_URL.locataires}${id}`);
    }
};

export default LocataireService;
