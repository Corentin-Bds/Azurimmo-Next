import Batiment from "@/models/Batiment";


export default class Appartement {
    id!: number;
    numero!: number;
    surface!: number;
    nbrPiece!: number;
    description!: string;
    batiment!: Batiment;

    constructor() {
        this.numero = 0;
        this.surface = 0;
        this.nbrPiece = 0;
        this.description = "";
        this.batiment = new Batiment();
    }
}