import Contrat from "@/models/Contrat";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

const ContratService = {
    getContratByAppartement: async (appartementId: number): Promise<Contrat | null> => {
        try {
            const contrat = await HttpService.get(`${API_URL.contrats}appartement/${appartementId}`);
            return contrat;
        } catch (e){
            return null;
        }
    },

    deleteByLocataireId: (locataireId: number) =>
        HttpService.delete(API_URL.contrats + "locataire/" + locataireId),

    getAll: async (): Promise<Contrat[]> => {
        try {
            const response = await HttpService.get(API_URL.contrats);
            return Array.isArray(response) ? response : response.data || [];
        } catch (error) {
            console.error("Erreur lors de la récupération des contrats :", error);
            return [];
        }
    },

    // Récupérer un contrat par son ID
    getById: async (id: number): Promise<Contrat> => {
        return await HttpService.get(`${API_URL.contrats}${id}`);
    },

    // Créer un contrat
    create: async (data: Omit<Contrat, "id">): Promise<Contrat> => {
        return await HttpService.post(API_URL.contrats, data);
    },

    // Modifier un contrat
    update: async (id: number, data: Contrat): Promise<Contrat> => {
        return await HttpService.put(`${API_URL.contrats}${id}`, data);
    },

    // Supprimer un contrat
    delete: async (id: number): Promise<boolean> => {
        return await HttpService.delete(`${API_URL.contrats}${id}`);
    }
};

export default ContratService;