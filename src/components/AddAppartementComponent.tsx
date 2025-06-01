"use client";

import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import Appartement from "@/models/Appartement";
import Contrat from "@/models/Contrat";
import Locataire from "@/models/Locataire";

interface Props {
    batimentId: number;
    locataires: Locataire[];
    contrats: Contrat[];
    appartement?: Appartement | null;
    onAddSuccess: () => void;
    onCancel: () => void;
    onSubmit: (appartementData: any) => void;
}

export default function AddAppartementComponent({
                                                    batimentId,
                                                    locataires,
                                                    contrats,
                                                    appartement,
                                                    onAddSuccess,
                                                    onCancel,
                                                    onSubmit,
                                                }: Props) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const isEdit = !!(appartement?.id);

    useEffect(() => {
        if (appartement) {
            // Pré-remplir le formulaire en mode édition
            form.setFieldsValue({
                numero: appartement.numero,
                surface: appartement.surface,
                nbrPiece: appartement.nbrPiece,
                description: appartement.description,
                // Pour les relations, on peut ajouter locataireId et contratId si nécessaire
            });
        } else {
            // Réinitialiser le formulaire en mode création
            form.resetFields();
        }
    }, [appartement, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const appartementData = {
                ...values,
                id: appartement?.id || 0,
                batiment: { id: batimentId },
                // Ajouter les relations si elles sont sélectionnées
                locataire: values.locataireId ? { id: values.locataireId } : null,
                contrat: values.contratId ? { id: values.contratId } : null,
            };

            onSubmit(appartementData);
        } catch (error) {
            console.error("Erreur validation formulaire:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les contrats disponibles (sans appartement assigné)
    const contratsDisponibles = contrats.filter(c =>
        !c.appartement || c.appartement.id === appartement?.id
    );

    return (
        <Modal
            open={true}
            title={isEdit ? "Modifier l'appartement" : "Ajouter un appartement"}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText="Valider"
            cancelText="Annuler"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Numéro de l'appartement"
                    name="numero"
                    rules={[
                        { required: true, message: "Le numéro est requis." },
                        { type: "number", min: 1, message: "Le numéro doit être supérieur à 0." }
                    ]}
                >
                    <InputNumber className="w-full" min={1} placeholder="Ex: 101" />
                </Form.Item>

                <Form.Item
                    label="Surface (m²)"
                    name="surface"
                    rules={[
                        { required: true, message: "La surface est requise." },
                        { type: "number", min: 1, message: "La surface doit être supérieure à 0." }
                    ]}
                >
                    <InputNumber
                        className="w-full"
                        min={1}
                        step={0.5}
                        placeholder="Ex: 45.5"
                        addonAfter="m²"
                    />
                </Form.Item>

                <Form.Item
                    label="Nombre de pièces"
                    name="nbrPiece"
                    rules={[
                        { required: true, message: "Le nombre de pièces est requis." },
                        { type: "number", min: 1, message: "Le nombre de pièces doit être supérieur à 0." }
                    ]}
                >
                    <InputNumber className="w-full" min={1} max={20} placeholder="Ex: 3" />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: "La description est requise." },
                        { min: 10, message: "La description doit contenir au moins 10 caractères." }
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Description détaillée de l'appartement (équipements, état, particularités...)"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Locataire actuel"
                        name="locataireId"
                        help="Optionnel - Assigner un locataire à cet appartement"
                    >
                        <Select
                            placeholder="Sélectionner un locataire"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {locataires && locataires.length > 0 ? (
                                locataires.map(loc => (
                                    <Select.Option key={loc.id} value={loc.id}>
                                        {loc.nom} {loc.prenom}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option disabled value="">
                                    Aucun locataire disponible
                                </Select.Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Contrat"
                        name="contratId"
                        help="Optionnel - Lier un contrat existant"
                    >
                        <Select
                            placeholder="Sélectionner un contrat"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {contratsDisponibles && contratsDisponibles.length > 0 ? (
                                contratsDisponibles.map(c => (
                                    <Select.Option key={c.id} value={c.id}>
                                        Contrat #{c.id} - {c.locataire?.nom} {c.locataire?.prenom}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option disabled value="">
                                    Aucun contrat disponible
                                </Select.Option>
                            )}
                        </Select>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}