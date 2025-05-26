import { Modal } from "antd";
import Contrat from "@/models/Contrat";

export default function ContratModal({
    visible,
    contrat,
    onClose
}: {
    visible : boolean;
    contrat : Contrat | null;
    onClose: (show: boolean) => void;
}) {
    if (!contrat) return null;

    return (
        <Modal open={visible} onCancel={onClose} footer={null} title="Détails du contrat">
            {contrat.locataire ? (
                <>
                    <p><strong>Locataire :</strong> {contrat.locataire.nom} {contrat.locataire.prenom}</p>
                    <p><strong>Email :</strong> {contrat.locataire.email}</p>
                    <p><strong>Téléphone :</strong> {contrat.locataire.telephone}</p>
                </>
            ) : (
                <p><strong>Locataire :</strong> Aucun locataire lié</p>
            )}

            <p><strong>Loyer :</strong> {contrat.montantLoyer} €</p>
            <p><strong>Charges :</strong> {contrat.montantCharges} €</p>
            <p><strong>Du :</strong> {contrat.dateDebut}</p>
            <p><strong>Au :</strong> {contrat.dateFin}</p>
        </Modal>
    )
}
