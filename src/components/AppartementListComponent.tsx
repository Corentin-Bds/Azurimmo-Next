"use client";

import { useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Appartement from "@/models/Appartement";
import AppartementService from "@/services/AppartementService";
import AddAppartementGlobalComponent from "@/components/AddAppartementGlobalComponent";
import ContratModal from "@/components/ContratModal";
import ContratService from "@/services/ContratService";
import Contrat from "@/models/Contrat";
import Link from "next/link";

export default function AppartementListComponent({
                                                     appartements: initialAppartements,
                                                 }: {
    appartements: Appartement[];
}) {
    const [appartements, setAppartements] = useState<Appartement[]>(initialAppartements);
    const [showDialog, setShowDialog] = useState(false);
    const [appartementToEdit, setAppartementToEdit] = useState<Appartement | null>(null);
    const [showContratModal, setShowContratModal] = useState(false);
    const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);

    const handleSubmit = async (appartement: Appartement) => {
        try {
            const isEdit = !!appartement.id;
            let updated;

            if (isEdit) {
                updated = await AppartementService.update(appartement.id!, appartement);
                setAppartements(appartements.map((a) => (a.id === updated.id ? updated : a)));
                message.success("Appartement modifié.");
            } else {
                updated = await AppartementService.create(appartement);
                setAppartements([...appartements, updated]);
                message.success("Appartement ajouté.");
            }

            setShowDialog(false);
            setAppartementToEdit(null);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de l'enregistrement.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await AppartementService.delete(id);
            setAppartements(appartements.filter((a) => a.id !== id));
            message.success("Appartement supprimé.");
        } catch (error) {
            console.error("Erreur suppression :", error);
            message.error("Suppression impossible.");
        }
    };

    const showContratDetails = async (appartementId: number) => {
        try {
            const contrat = await ContratService.getContratByAppartement(appartementId);
            if (contrat) {
                setSelectedContrat(contrat);
                setShowContratModal(true);
            } else {
                message.info("Aucun contrat associé à cet appartement.");
            }
        } catch (error) {
            message.error("Erreur lors de la récupération du contrat.");
        }
    };

    const columns = [
        {
            title: "Numéro",
            dataIndex: "numero",
            key: "numero",
            render: (numero: number) => <Tag color="blue">N°{numero}</Tag>,
            sorter: (a: Appartement, b: Appartement) => a.numero - b.numero,
        },
        {
            title: "Bâtiment",
            key: "batiment",
            render: (_: any, record: Appartement) => (
                <div>
                    <div>{record.batiment?.adresse}</div>
                    <small className="text-gray-500">{record.batiment?.ville}</small>
                </div>
            ),
        },
        {
            title: "Surface",
            dataIndex: "surface",
            key: "surface",
            render: (surface: number) => `${surface} m²`,
            sorter: (a: Appartement, b: Appartement) => a.surface - b.surface,
        },
        {
            title: "Pièces",
            dataIndex: "nbrPiece",
            key: "nbrPiece",
            render: (nbrPiece: number) => `${nbrPiece} pièce${nbrPiece > 1 ? 's' : ''}`,
            sorter: (a: Appartement, b: Appartement) => a.nbrPiece - b.nbrPiece,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Contrat",
            key: "contrat",
            render: (_: any, record: Appartement) => (
                <Button
                    size="small"
                    onClick={() => showContratDetails(record.id)}
                    icon={<EyeOutlined />}
                >
                    Voir contrat
                </Button>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Appartement) => (
                <>
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
                        onClick={() => handleDelete(record.id!)}
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: 8 }}
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Appartements</h2>

            <Button
                type="primary"
                className="mb-4"
                onClick={() => {
                    setAppartementToEdit(null);
                    setShowDialog(true);
                }}
            >
                Ajouter un appartement
            </Button>

            {showDialog && (
                <AddAppartementGlobalComponent
                    appartement={
                        appartementToEdit ?? {
                            id: 0,
                            numero: 0,
                            surface: 0,
                            nbrPiece: 0,
                            description: "",
                            batiment: { id: 0, adresse: "", ville: "" },
                        }
                    }
                    onClose={() => {
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

            <Table
                dataSource={appartements}
                rowKey="id"
                columns={columns}
                pagination={{ pageSize: 10 }}
            />

            <div className="mt-4">
                <Link href="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>
        </>
    );
}
