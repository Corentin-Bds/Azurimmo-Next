import LocataireComponent from "@/components/LocataireComponent";
import LocataireService from "@/services/LocataireService";

export default async function LocatairePage() {
    const locataires = await LocataireService.getAll(); // appel côté serveur

    return <LocataireComponent locataires={locataires} />;
}