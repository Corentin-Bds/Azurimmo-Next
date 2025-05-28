"use client";

import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
import Appartement from "@/models/Appartement";
import API_URL from "@/constants/ApiUrl";
import HttpService from "@/services/HttpService";
import Contrat from "@/models/Contrat";
import Locataire from "@/models/Locataire";

export default function AddAppartementComponent({
                                                    batimentId,
                                                    locataires,
                                                    contrats,
                                                    onAddSuccess,
                                                    onCancel,
                                                }: {
    batimentId: number;
    locataires: Locataire[];
    contrats: Contrat[];
    onAddSuccess: () => void;
    onCancel: () => void;
}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await HttpService.post(API_URL.appartements, {
                ...values,
                batiment: { id: batimentId },
                locataire: values.locataireId ? { id: values.locataireId } : null,
                contrat: values.contratId ? { id: values.contratId } : null,
            });
            onAddSuccess();
        } catch (error) {
            console.error("Erreur ajout appartement:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={true}
            title="Ajouter un appartement"
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText="Valider"
            cancelText="Annuler"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Numéro"
                    name="numero"
                    rules={[{ required: true, message: "Le numéro est requis." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Surface (m²)"
                    name="surface"
                    rules={[{ required: true, message: "La surface est requise." }]}
                >
                    <InputNumber className="w-full" min={1} />
                </Form.Item>
                <Form.Item
                    label="Nombre de pièces"
                    name="nbrPiece"
                    rules={[{ required: true, message: "Le nombre de pièces est requis." }]}
                >
                    <InputNumber className="w-full" min={1} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "La description est requise." }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Locataire" name="locataireId">
                    <Select placeholder="Sélectionner un locataire" allowClear>
                        {locataires && locataires.length > 0 ? (
                            locataires.map(loc => (
                                <Select.Option key={loc.id} value={loc.id}>
                                    {loc.nom} {loc.prenom}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option disabled>Aucun locataire disponible</Select.Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item label="Contrat" name="contratId">
                    <Select placeholder="Sélectionner un contrat" allowClear>
                        {contrats && contrats.length > 0 ? (
                            contrats.map(c => (
                                <Select.Option key={c.id} value={c.id}>
                                    Contrat #{c.id}
                                </Select.Option>
                            ))
                        ) : (
                            <Select.Option disabled>Pas de contrat disponible</Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}
