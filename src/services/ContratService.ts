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
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des contrats :", error);
            return [];
        }
    },
};

export default ContratService;