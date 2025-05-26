import Locataire from "@/models/Locataire";

export default interface Contrat {
    id: number;
    montantLoyer: number;
    montantCharges: number;
    dateDebut: string;
    dateFin: string;
    locataire: Locataire;
    appartementId: number;
}