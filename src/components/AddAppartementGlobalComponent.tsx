"use client";

import { Form, Modal, InputNumber, Input, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import Appartement from "@/models/Appartement";
import Batiment from "@/models/Batiment";
import Locataire from "@/models/Locataire";
import Contrat from "@/models/Contrat";
import BatimentService from "@/services/BatimentService";
import LocataireService from "@/services/LocataireService";
import ContratService from "@/services/ContratService";

interface Props {
    appartement: Appartement;
    onClose: () => void;
    onSubmit: (appartement: Appartement) => void;
}

export default function AddAppartementGlobalComponent({
                                                          appartement,
                                                          onClose,
                                                          onSubmit
                                                      }: Props) {
    const [form] = Form.useForm();
    const [batiments, setBatiments] = useState<Batiment[]>([]);
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [contrats, setContrats] = useState<Contrat[]>([]);
    const [loadingBatiments, setLoadingBatiments] = useState(true);
    const [loadingLocataires, setLoadingLocataires] = useState(true);
    const [loadingContrats, setLoadingContrats] = useState(true);

    useEffect(() => {
        // Charger les bâtiments
        const fetchBatiments = async () => {
            try {
                const data = await BatimentService.getAll();
                setBatiments(data);
            } catch (err) {
                console.error("Erreur lors du chargement des bâtiments :", err);
            } finally {
                setLoadingBatiments(false);
            }
        };

        // Charger les locataires
        const fetchLocataires = async () => {
            try {
                const data = await LocataireService.getAll();
                setLocataires(data);
            } catch (err) {
                console.error("Erreur lors du chargement des locataires :", err);
            } finally {
                setLoadingLocataires(false);
            }
        };

        // Charger les contrats
        const fetchContrats = async () => {
            try {
                const data = await ContratService.getAll();
                setContrats(data);
            } catch (err) {
                console.error("Erreur lors du chargement des contrats :", err);
            } finally {
                setLoadingContrats(false);
            }
        };

        fetchBatiments();
        fetchLocataires();
        fetchContrats();

        // Pré-remplir le formulaire
        form.setFieldsValue({
            numero: appartement.numero,
            surface: appartement.surface,
            nbrPiece: appartement.nbrPiece,
            description: appartement.description,
            batimentId: appartement.batiment?.id,
        });
    }, [form, appartement]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Trouver le bâtiment sélectionné
                const selectedBatiment = batiments.find(b => b.id === values.batimentId);

                const updatedAppartement: Appartement = {
                    ...appartement,
                    numero: values.numero,
                    surface: values.surface,
                    nbrPiece: values.nbrPiece,
                    description: values.description,
                    batiment: selectedBatiment || appartement.batiment,
                };
                onSubmit(updatedAppartement);
            })
            .catch(() => {});
    };

    // Filtrer les contrats disponibles (sans appartement assigné ou assigné à cet appartement)
    const contratsDisponibles = contrats.filter(c =>
        !c.appartement || c.appartement.id === appartement.id
    );

    return (
        <Modal
            title={appartement.id ? "Modifier l'appartement" : "Ajouter un appartement"}
            open={true}
            onCancel={onClose}
            onOk={handleOk}
            okText="Valider"
            cancelText="Annuler"
            width={700}
        >
            <Form form={form} layout="vertical">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="batimentId"
                        label="Bâtiment"
                        rules={[{ required: true, message: "Le bâtiment est obligatoire." }]}
                    >
                        {loadingBatiments ? (
                            <Spin />
                        ) : (
                            <Select placeholder="Sélectionner un bâtiment">
                                {batiments.map((batiment) => (
                                    <Select.Option key={batiment.id} value={batiment.id}>
                                        {batiment.adresse} - {batiment.ville}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="numero"
                        label="Numéro de l'appartement"
                        rules={[
                            { required: true, message: "Le numéro est obligatoire." },
                            { type: "number", min: 1, message: "Le numéro doit être supérieur à 0." },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            placeholder="Ex: 101"
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="surface"
                        label="Surface (m²)"
                        rules={[
                            { required: true, message: "La surface est obligatoire." },
                            { type: "number", min: 1, message: "La surface doit être supérieure à 0." },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            step={0.5}
                            placeholder="Ex: 45.5"
                            addonAfter="m²"
                        />
                    </Form.Item>

                    <Form.Item
                        name="nbrPiece"
                        label="Nombre de pièces"
                        rules={[
                            { required: true, message: "Le nombre de pièces est obligatoire." },
                            { type: "number", min: 1, message: "Le nombre de pièces doit être supérieur à 0." },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            max={20}
                            placeholder="Ex: 3"
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { required: true, message: "La description est obligatoire." },
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
                        name="locataireId"
                        label="Locataire actuel"
                        help="Optionnel - Assigner un locataire"
                    >
                        {loadingLocataires ? (
                            <Spin />
                        ) : (
                            <Select
                                placeholder="Sélectionner un locataire"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {locataires.map((locataire) => (
                                    <Select.Option key={locataire.id} value={locataire.id}>
                                        {locataire.nom} {locataire.prenom}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="contratId"
                        label="Contrat"
                        help="Optionnel - Lier un contrat existant"
                    >
                        {loadingContrats ? (
                            <Spin />
                        ) : (
                            <Select
                                placeholder="Sélectionner un contrat"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                            >
                                {contratsDisponibles.map((contrat) => (
                                    <Select.Option key={contrat.id} value={contrat.id}>
                                        Contrat #{contrat.id} - {contrat.locataire?.nom} {contrat.locataire?.prenom}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
}