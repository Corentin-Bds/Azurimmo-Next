import { useEffect, useState } from "react";
import { Button, Table, message, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import Appartement from "@/models/Appartement";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import Contrat from "@/models/Contrat";
import ContratService from "@/services/ContratService";
import ContratModal from "@/components/ContratModal";
import AddAppartementComponent from "@/components/AddAppartementComponent";
import Locataire from "@/models/Locataire";
import LocataireService from "@/services/LocataireService";

export default function NestedAppartementTable({ batimentId }: { batimentId: number }) {
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [contrats, setContrats] = useState<{ [key: number]: Contrat | null }>({});
    const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [allContrats, setAllContrats] = useState<Contrat[]>([]);

    useEffect(() => {
        fetchAppartements();
        fetchLocataires();
        fetchContrats();
    }, [batimentId]);

    const fetchAppartements = async () => {
        const result = await fetch(`${API_URL.appartements}batiment/${batimentId}`);
        const data = await result.json();
        setAppartements(data);

        for (const appart of data) {
            const contrat = await ContratService.getContratByAppartement(appart.id);
            setContrats(prev => ({ ...prev, [appart.id]: contrat }));
        }
    };

    const fetchLocataires = async () => {
        try {
            const data = await LocataireService.getAll();
            setLocataires(data);
        } catch (error) {
            console.error("Erreur lors du chargement des locataires:", error);
        }
    };

    const fetchContrats = async () => {
        try {
            const data = await ContratService.getAll();
            setAllContrats(data);
        } catch (error) {
            console.error("Erreur lors du chargement des contrats:", error);
        }
    };

    const handleDeleteAppartement = async (appartementId: number) => {
        try {
            await HttpService.delete(`${API_URL.appartements}${appartementId}`);
            message.success("Appartement supprimé avec succès");
            fetchAppartements(); // Recharger la liste
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            message.error("Erreur lors de la suppression de l'appartement");
        }
    };

    const handleAddSuccess = () => {
        setShowAddModal(false);
        fetchAppartements(); // Recharger la liste
        message.success("Appartement ajouté avec succès");
    };

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
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Appartement) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Popconfirm
                        title="Supprimer cet appartement"
                        description="Êtes-vous sûr de vouloir supprimer cet appartement ? Cette action supprimera aussi tous les contrats liés."
                        onConfirm={() => handleDeleteAppartement(record.id)}
                        okText="Oui"
                        cancelText="Non"
                        okType="danger"
                    >
                        <Button
                            shape="circle"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddModal(true)}
                >
                    Ajouter un appartement
                </Button>
            </div>

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

            {showAddModal && (
                <AddAppartementComponent
                    batimentId={batimentId}
                    locataires={locataires}
                    contrats={allContrats}
                    onAddSuccess={handleAddSuccess}
                    onCancel={() => setShowAddModal(false)}
                />
            )}
        </>
    );
}