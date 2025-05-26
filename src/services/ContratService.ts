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
    }
};

export default ContratService;