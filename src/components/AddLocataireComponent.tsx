"use client";

import { Form, Input, Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import Locataire from "@/models/Locataire";
import Contrat from "@/models/Contrat";
import ContratService from "@/services/ContratService";

interface Props {
    locataire: Locataire;
    onClose: () => void;
    onSubmit: (locataire: Locataire) => void;
}

export default function AddLocataireComponent({ locataire, onClose, onSubmit }: Props) {
    const [form] = Form.useForm();
    const [contrats, setContrats] = useState<Contrat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        form.setFieldsValue(locataire);

        const fetchContrats = async () => {
            try {
                const data = await ContratService.getAll();
                setContrats(data);
            } catch (err) {
                console.error("Erreur lors du chargement des contrats :", err);
                setContrats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchContrats();
    }, [form, locataire]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const updatedLocataire: Locataire = {
                    ...locataire,
                    ...values,
                };
                onSubmit(updatedLocataire);
            })
            .catch(() => {});
    };

    return (
        <Modal
            title={locataire.id ? "Modifier le locataire" : "Ajouter un locataire"}
            open={true}
            onCancel={onClose}
            onOk={handleOk}
            okText="Valider"
            cancelText="Annuler"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true, message: "Le nom est obligatoire." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[{ required: true, message: "Le prénom est obligatoire." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ type: "email", message: "Email invalide." }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="telephone" label="Téléphone">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
