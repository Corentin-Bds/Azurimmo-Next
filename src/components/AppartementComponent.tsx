"use client";

import { useEffect, useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Appartement from "@/models/Appartement";
import AppartementService from "@/services/AppartementService";
import AddAppartementComponent from "@/components/AddAppartementComponent";
import ContratService from "@/services/ContratService";
import LocataireService from "@/services/LocataireService";
import ContratModal from "@/components/ContratModal";
import Contrat from "@/models/Contrat";
import Locataire from "@/models/Locataire";

export default function AppartementComponent({
                                                 batimentId
                                             }: {
    batimentId: number
}) {
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [appartementToEdit, setAppartementToEdit] = useState<Appartement | null>(null);
    const [loading, setLoading] = useState(true);
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [contrats, setContrats] = useState<Contrat[]>([]);
    const [showContratModal, setShowContratModal] = useState(false);
    const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);
    const [appartementsContrats, setAppartementsContrats] = useState<{ [key: number]: Contrat | null }>({});

    // Charger les données initiales
    useEffect(() => {
        fetchAppartements();
        fetchLocataires();
        fetchContrats();
    }, [batimentId]);

    // Charger les contrats pour chaque appartement
    useEffect(() => {
        if (appartements.length > 0) {
            loadContratsForAppartements();
        }
    }, [appartements]);

    const fetchAppartements = async () => {
        try {
            setLoading(true);
            const data = await AppartementService.getByBatimentId(batimentId);
            setAppartements(data);
        } catch (error) {
            console.error("Erreur lors du chargement des appartements:", error);
            message.error("Erreur lors du chargement des appartements");
        } finally {
            setLoading(false);
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
            setContrats(data);
        } catch (error) {
            console.error("Erreur lors du chargement des contrats:", error);
        }
    };

    const loadContratsForAppartements = async () => {
        const contratsMap: { [key: number]: Contrat | null } = {};

        for (const appartement of appartements) {
            try {
                const contrat = await ContratService.getContratByAppartement(appartement.id);
                contratsMap[appartement.id] = contrat;
            } catch (error) {
                contratsMap[appartement.id] = null;
            }
        }

        setAppartementsContrats(contratsMap);
    };

    const handleSubmit = async (appartementData: any) => {
        try {
            const isEdit = !!appartementToEdit?.id;
            let savedAppartement;

            if (isEdit) {
                savedAppartement = await AppartementService.update(appartementToEdit!.id, {
                    ...appartementData,
                    id: appartementToEdit!.id,
                    batiment: { id: batimentId }
                });
                setAppartements(appartements.map(a =>
                    a.id === savedAppartement.id ? savedAppartement : a
                ));
                message.success("Appartement modifié avec succès");
            } else {
                savedAppartement = await AppartementService.create({
                    ...appartementData,
                    batiment: { id: batimentId }
                });
                setAppartements([...appartements, savedAppartement]);
                message.success("Appartement ajouté avec succès");
            }

            setShowDialog(false);
            setAppartementToEdit(null);

            // Recharger les contrats après modification
            loadContratsForAppartements();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error);
            message.error("Erreur lors de l'enregistrement de l'appartement");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await AppartementService.delete(id);
            setAppartements(appartements.filter(a => a.id !== id));
            message.success("Appartement supprimé avec succès");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            message.error("Erreur lors de la suppression de l'appartement");
        }
    };

    const showContratDetails = (contrat: Contrat) => {
        setSelectedContrat(contrat);
        setShowContratModal(true);
    };

    const columns = [
        {
            title: "Numéro",
            dataIndex: "numero",
            key: "numero",
            render: (numero: number) => <Tag color="blue">N°{numero}</Tag>
        },
        {
            title: "Surface (m²)",
            dataIndex: "surface",
            key: "surface",
            render: (surface: number) => `${surface} m²`
        },
        {
            title: "Pièces",
            dataIndex: "nbrPiece",
            key: "nbrPiece",
            render: (nbrPiece: number) => `${nbrPiece} pièce${nbrPiece > 1 ? 's' : ''}`
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true
        },
        {
            title: "Locataire",
            key: "locataire",
            render: (_: any, record: Appartement) => {
                const contrat = appartementsContrats[record.id];
                return contrat?.locataire ? (
                    <span>{contrat.locataire.nom} {contrat.locataire.prenom}</span>
                ) : (
                    <Tag color="default">Libre</Tag>
                );
            }
        },
        {
            title: "Contrat",
            key: "contrat",
            render: (_: any, record: Appartement) => {
                const contrat = appartementsContrats[record.id];
                return contrat ? (
                    <Button
                        size="small"
                        onClick={() => showContratDetails(contrat)}
                        icon={<EyeOutlined />}
                    >
                        Voir contrat
                    </Button>
                ) : (
                    <Tag color="orange">Aucun contrat</Tag>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Appartement) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        shape="circle"
                        onClick={() => {
                            setAppartementToEdit(record);
                            setShowDialog(true);
                        }}
                        icon={<EditOutlined />}
                    />
                    <Button
                        size="small"
                        shape="circle"
                        danger
                        onClick={() => handleDelete(record.id)}
                        icon={<DeleteOutlined />}
                    />
                </div>
            )
        }
    ];

    if (loading) {
        return <div>Chargement des appartements...</div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                    Appartements ({appartements.length})
                </h3>
                <Button
                    type="primary"
                    onClick={() => {
                        setAppartementToEdit(null);
                        setShowDialog(true);
                    }}
                >
                    Ajouter un appartement
                </Button>
            </div>

            <Table
                dataSource={appartements}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="small"
            />

            {showDialog && (
                <AddAppartementComponent
                    batimentId={batimentId}
                    locataires={locataires}
                    contrats={contrats}
                    appartement={appartementToEdit}
                    onAddSuccess={() => {
                        setShowDialog(false);
                        setAppartementToEdit(null);
                        fetchAppartements();
                    }}
                    onCancel={() => {
                        setShowDialog(false);
                        setAppartementToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}

            <ContratModal
                visible={showContratModal}
                contrat={selectedContrat}
                onClose={() => {
                    setShowContratModal(false);
                    setSelectedContrat(null);
                }}
            />
        </div>
    );
}