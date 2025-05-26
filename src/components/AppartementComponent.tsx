import { useEffect, useState } from "react";
import {Button, Table} from "antd";
import Appartement from "@/models/Appartement";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import Contrat from "@/models/Contrat";
import ContratService from "@/services/ContratService";
import ContratModal from "@/components/ContratModal";

export default function NestedAppartementTable({ batimentId }: { batimentId: number }) {
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [contrats, setContrats] = useState<{ [key: number]: Contrat | null }>({});
    const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAppartements = async () => {
            const result = await fetch(`${API_URL.appartements}batiment/${batimentId}`);
            const data = await result.json();
            setAppartements(data);

            for (const appart of data) {
                const contrat = await ContratService.getContratByAppartement(appart.id);
                setContrats(prev => ({ ...prev, [appart.id]: contrat }));
            }
        };

        fetchAppartements();
    }, [batimentId]);

    const columns = [
        { title: "Numéro de l'appartement", dataIndex: "numero", key: "numero" },
        { title: "Surface en m²", dataIndex: "surface", key: "surface" },
        { title: "Nombre de Pièces", dataIndex: "nbrPiece", key: "nbrPiece" },
        { title: "Description de l'appartement", dataIndex: "description", key: "description" },
        {
            title: "Locataire",
            key: "locataire",
            render: (_: any, record: Appartement) => {
                const contrat = contrats[record.id];
                return contrat?.locataire
                    ? `${contrat.locataire.nom} ${contrat.locataire.prenom}`
                    : "Aucun";
            }
        },
        {
            title: "Contrat",
            key: "contrat",
            render: (_: any, record: Appartement) => {
                const contrat = contrats[record.id];
                return contrat ? (
                    <Button onClick={() => {
                        setSelectedContrat(contrat);
                        setShowModal(true);
                    }}>
                        Voir contrat
                    </Button>
                ) : (
                    "Aucun"
                );
            }
        }
    ];

    return (
        <>
        <Table
            dataSource={appartements}
            rowKey="id"
            columns={columns}
            pagination={false}
        />
        <ContratModal
            visible={showModal}
            contrat={selectedContrat}
            onClose={() => {
                setShowModal(false);
                setSelectedContrat(null);
            }}
        />
        </>
    );
}