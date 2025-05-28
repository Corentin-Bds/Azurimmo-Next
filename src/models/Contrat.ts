import Locataire from "@/models/Locataire";
import Appartement from "@/models/Appartement";

export default interface Contrat {
    id: number;
    montantLoyer: number;
    montantCharges: number;
    dateDebut: string;
    dateFin: string;
    locataire: Locataire;
    appartementId: number;
    appartement?: Appartement; // Ajout de l'objet appartement optionnel
}