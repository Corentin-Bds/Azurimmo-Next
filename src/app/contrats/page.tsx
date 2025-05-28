import ContratComponent from "@/components/ContratComponent";
import ContratService from "@/services/ContratService";

export default async function ContratPage() {
    const contrats = await ContratService.getAll();
    console.log('contrats', contrats);

    return <ContratComponent contrats={contrats} />;
}