"use client";

import { useState } from "react";
import { Button, Table, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Locataire from "@/models/Locataire";
import LocataireService from "@/services/LocataireService";
import AddLocataireComponent from "@/components/AddLocataireComponent";
import Link from "next/link";

export default function LocataireComponent({
                                               locataires: initialLocataires,
                                           }: {
    locataires: Locataire[];
}) {
    const [locataires, setLocataires] = useState<Locataire[]>(initialLocataires);
    const [showDialog, setShowDialog] = useState(false);
    const [locataireToEdit, setLocataireToEdit] = useState<Locataire | null>(null);

    const handleSubmit = async (locataire: Locataire) => {
        try {
            const isEdit = !!locataire.id;
            let updated;

            if (isEdit) {
                updated = await LocataireService.update(locataire.id!, locataire);
                setLocataires(locataires.map((l) => (l.id === updated.id ? updated : l)));
                message.success("Locataire modifié.");
            } else {
                updated = await LocataireService.create(locataire);
                setLocataires([...locataires, updated]);
                message.success("Locataire ajouté.");
            }

            setShowDialog(false);
            setLocataireToEdit(null);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de l'enregistrement.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await LocataireService.delete(id);
            setLocataires(locataires.filter((l) => l.id !== id));
            message.success("Locataire supprimé.");
        } catch (error) {
            console.error("Erreur suppression :", error);
            message.error("Suppression impossible.");
        }
    };

    const columns = [
        {
            title: "Nom",
            dataIndex: "nom",
            key: "nom",
        },
        {
            title: "Prénom",
            dataIndex: "prenom",
            key: "prenom",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Téléphone",
            dataIndex: "telephone",
            key: "telephone",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Locataire) => (
                <>
                    <Button
                        shape="circle"
                        onClick={() => {
                            setLocataireToEdit(record);
                            setShowDialog(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Button shape="circle" danger onClick={() => handleDelete(record.id!)}>
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Locataires</h2>

            <Button
                type="primary"
                className="mb-4"
                onClick={() => {
                    setLocataireToEdit(null);
                    setShowDialog(true);
                }}
            >
                Ajouter un locataire
            </Button>

            {showDialog && (
                <AddLocataireComponent
                    locataire={
                        locataireToEdit ?? {
                            nom: "",
                            prenom: "",
                            email: "",
                            telephone: "",
                        }
                    }
                    onClose={() => {
                        setShowDialog(false);
                        setLocataireToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}

            <Table
                dataSource={locataires}
                rowKey="id"
                columns={columns}
                pagination={false}
            />

            <div className="mt-4">
                <Link href="/">
                    <Button>Retour à l’accueil</Button>
                </Link>
            </div>
        </>
    );
}
