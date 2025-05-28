"use client";

import { useState } from "react";
import { Button, Table, message } from "antd";
import AddLocataireComponent from "@/components/AddLocataireComponent";
import ContratModal from "@/components/ContratModal";
import LocataireService from "@/services/LocataireService";
import Link from "next/link";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Locataire from "@/models/Locataire";
import Contrat from "@/models/Contrat";

export default function LocataireComponent({
                                               locataires: initialLocataires,
                                           }: {
    locataires: Locataire[];
}) {
    const [locataires, setLocataires] = useState<Locataire[]>(initialLocataires);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [locataireToEdit, setLocataireToEdit] = useState<Locataire | null>(null);
    const [selectedContrat, setSelectedContrat] = useState<Contrat | null>(null);

    const updateLocataire = async (locataire: Locataire) => {
        const isEdit = locataire.id !== undefined && locataire.id !== 0;
        let response;

        if (isEdit) {
            response = await LocataireService.update(locataire.id, locataire);
            setLocataires(locataires.map((l) => (l.id === response.id ? response : l)));
        } else {
            response = await LocataireService.create(locataire);
            setLocataires([...locataires, response]);
        }

        setShowDialog(false);
        setLocataireToEdit(null);
    };

    const handleDelete = async (id: number) => {
        try {
            await LocataireService.delete(id);
            setLocataires(locataires.filter((l) => l.id !== id));
        } catch (error) {
            console.error("Suppression échouée :", error);
            message.error("Ce locataire a un contrat actif. Suppression impossible.");
        }
    };

    const showContratModal = (contrat: Contrat) => {
        setSelectedContrat(contrat);
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
            title: "Contrat",
            key: "contrat",
            render: (_: any, record: Locataire) =>
                record.contrat ? (
                    <Button type="link" onClick={() => showContratModal(record.contrat)}>
                        Voir
                    </Button>
                ) : (
                    "Aucun"
                ),
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
                    <Button shape="circle" danger onClick={() => handleDelete(record.id)}>
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <h2>Locataires</h2>

            <Button
                onClick={() => {
                    setLocataireToEdit(null);
                    setShowDialog(true);
                }}
            >
                Ajouter...
            </Button>

            <Link href="/">
                <Button style={{ marginLeft: 10 }}>Retour à l'accueil</Button>
            </Link>

            <br />
            <br />

            {!showDialog && (
                <Table dataSource={locataires} rowKey="id" columns={columns} />
            )}

            {showDialog && (
                <AddLocataireComponent
                    locataire={
                        locataireToEdit || {
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
                    onSubmit={updateLocataire}
                />
            )}

            {selectedContrat && (
                <ContratModal
                    contrat={selectedContrat}
                    onClose={() => setSelectedContrat(null)}
                />
            )}
        </>
    );
}
