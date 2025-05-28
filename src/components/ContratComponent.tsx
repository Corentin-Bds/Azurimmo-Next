"use client";

import { useState } from "react";
import { Button, Table, Tag, message } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import Contrat from "@/models/Contrat";
import ContratService from "@/services/ContratService";
import AddContratComponent from "@/components/AddContratComponent";
import ContratModal from "@/components/ContratModal";
import Link from "next/link";

export default function ContratComponent({
                                             contrats: initialContrats,
                                         }: {
    contrats: Contrat[];
}) {
    const [contrats, setContrats] = useState<Contrat[]>(initialContrats);
    const [showDialog, setShowDialog] = useState(false);
    const [contratToEdit, setContratToEdit] = useState<Contrat | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [contratToView, setContratToView] = useState<Contrat | null>(null);

    const handleSubmit = async (contrat: Contrat) => {
        try {
            console.log("Contrat à envoyer:", contrat);
            const isEdit = !!contrat.id;
            let updated;

            if (isEdit) {
                updated = await ContratService.update(contrat.id!, contrat);
                console.log("Contrat mis à jour:", updated);
                setContrats(contrats.map((c) => (c.id === updated.id ? updated : c)));
                message.success("Contrat modifié.");
            } else {
                updated = await ContratService.create(contrat);
                setContrats([...contrats, updated]);
                message.success("Contrat ajouté.");
            }

            setShowDialog(false);
            setContratToEdit(null);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de l'enregistrement.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await ContratService.delete(id);
            setContrats(contrats.filter((c) => c.id !== id));
            message.success("Contrat supprimé.");
        } catch (error) {
            console.error("Erreur suppression :", error);
            message.error("Suppression impossible.");
        }
    };

    const columns = [
        {
            title: "N° Contrat",
            dataIndex: "id",
            key: "id",
            render: (id: number) => <Tag color="blue">#{id}</Tag>,
        },
        {
            title: "Locataire",
            key: "locataire",
            render: (_: any, record: Contrat) => {
                return record.locataire
                    ? `${record.locataire.nom} ${record.locataire.prenom}`
                    : <Tag color="red">Non assigné</Tag>;
            },
        },
        {
            title: "Appartement",
            key: "appartement",
            render: (_: any, record: Contrat) => {
                if (record.appartement) {
                    return `Appartement n°${record.appartement.numero}`;
                } else if (record.appartementId) {
                    return `Appartement #${record.appartementId}`;
                } else {
                    return <Tag color="red">Non assigné</Tag>;
                }
            },
        },
        {
            title: "Loyer",
            dataIndex: "montantLoyer",
            key: "montantLoyer",
            render: (montant: number) => `${montant} €`,
        },
        {
            title: "Charges",
            dataIndex: "montantCharges",
            key: "montantCharges",
            render: (montant: number) => `${montant} €`,
        },
        {
            title: "Date début",
            dataIndex: "dateDebut",
            key: "dateDebut",
            render: (date: string) => new Date(date).toLocaleDateString("fr-FR"),
        },
        {
            title: "Date fin",
            dataIndex: "dateFin",
            key: "dateFin",
            render: (date: string) => new Date(date).toLocaleDateString("fr-FR"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Contrat) => (
                <>
                    <Button
                        shape="circle"
                        onClick={() => {
                            setContratToView(record);
                            setShowDetailsModal(true);
                        }}
                    >
                        <EyeOutlined />
                    </Button>
                    <Button
                        shape="circle"
                        onClick={() => {
                            setContratToEdit(record);
                            setShowDialog(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        shape="circle"
                        danger
                        onClick={() => handleDelete(record.id!)}
                    >
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Contrats</h2>

            <Button
                type="primary"
                className="mb-4"
                onClick={() => {
                    setContratToEdit(null);
                    setShowDialog(true);
                }}
            >
                Ajouter un contrat
            </Button>

            {showDialog && (
                <AddContratComponent
                    contrat={
                        contratToEdit ?? {
                            id: 0,
                            montantLoyer: 0,
                            montantCharges: 0,
                            dateDebut: "",
                            dateFin: "",
                            locataire: {
                                id: 0,
                                nom: "",
                                prenom: "",
                                email: "",
                                telephone: "",
                            },
                            appartementId: 0,
                        }
                    }
                    onClose={() => {
                        setShowDialog(false);
                        setContratToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}

            <ContratModal
                visible={showDetailsModal}
                contrat={contratToView}
                onClose={(show) => {
                    setShowDetailsModal(false);
                    setContratToView(null);
                }}
            />

            <Table
                dataSource={contrats}
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