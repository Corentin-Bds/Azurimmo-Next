"use client";

import { Form, Modal, InputNumber, DatePicker, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import Contrat from "@/models/Contrat";
import Locataire from "@/models/Locataire";
import Appartement from "@/models/Appartement";
import LocataireService from "@/services/LocataireService";
import AppartementService from "@/services/AppartementService";
import dayjs from "dayjs";

interface Props {
    contrat: Contrat;
    onClose: () => void;
    onSubmit: (contrat: Contrat) => void;
}

export default function AddContratComponent({ contrat, onClose, onSubmit }: Props) {
    const [form] = Form.useForm();
    const [locataires, setLocataires] = useState<Locataire[]>([]);
    const [appartements, setAppartements] = useState<Appartement[]>([]);
    const [loadingLocataires, setLoadingLocataires] = useState(true);
    const [loadingAppartements, setLoadingAppartements] = useState(true);

    useEffect(() => {
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

        // Charger les appartements
        const fetchAppartements = async () => {
            try {
                const data = await AppartementService.getAll();
                console.log("Appartements chargés:", data);
                setAppartements(data);
            } catch (err) {
                console.error("Erreur lors du chargement des appartements :", err);
            } finally {
                setLoadingAppartements(false);
            }
        };

        fetchLocataires();
        fetchAppartements();

        // Pré-remplir le formulaire
        form.setFieldsValue({
            montantLoyer: contrat.montantLoyer,
            montantCharges: contrat.montantCharges,
            locataireId: contrat.locataire?.id,
            appartementId: contrat.appartementId,
            dateDebut: contrat.dateDebut ? dayjs(contrat.dateDebut) : null,
            dateFin: contrat.dateFin ? dayjs(contrat.dateFin) : null,
        });
    }, [form, contrat]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Trouver l'appartement sélectionné
                const selectedAppartement = appartements.find(a => a.id === values.appartementId);
                const selectedLocataire = locataires.find(l => l.id === values.locataireId);

                const updatedContrat: Contrat = {
                    ...contrat,
                    montantLoyer: values.montantLoyer,
                    montantCharges: values.montantCharges,
                    dateDebut: values.dateDebut?.format("YYYY-MM-DD"),
                    dateFin: values.dateFin?.format("YYYY-MM-DD"),
                    appartementId: values.appartementId,
                    locataire: selectedLocataire || contrat.locataire,
                    // Ajouter l'objet appartement si nécessaire
                    appartement: selectedAppartement
                };
                onSubmit(updatedContrat);
            })
            .catch(() => {});
    };

    return (
        <Modal
            title={contrat.id ? "Modifier le contrat" : "Ajouter un contrat"}
            open={true}
            onCancel={onClose}
            onOk={handleOk}
            okText="Valider"
            cancelText="Annuler"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="locataireId"
                    label="Locataire"
                    rules={[{ required: true, message: "Le locataire est obligatoire." }]}
                >
                    {loadingLocataires ? (
                        <Spin />
                    ) : (
                        <Select placeholder="Sélectionner un locataire">
                            {locataires.map((locataire) => (
                                <Select.Option key={locataire.id} value={locataire.id}>
                                    {locataire.nom} {locataire.prenom}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    name="appartementId"
                    label="Appartement"
                    rules={[{ required: true, message: "L'appartement est obligatoire." }]}
                >
                    {loadingAppartements ? (
                        <Spin />
                    ) : (
                        <Select placeholder="Sélectionner un appartement" allowClear>
                            {appartements.map((appartement) => (
                                <Select.Option key={appartement.id} value={appartement.id}>
                                    Appartement n°{appartement.numero} - {appartement.surface}m²
                                    ({appartement.nbrPiece} pièce{appartement.nbrPiece > 1 ? 's' : ''})
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    name="montantLoyer"
                    label="Montant du loyer (€)"
                    rules={[
                        { required: true, message: "Le montant du loyer est obligatoire." },
                        { type: "number", min: 0, message: "Le montant doit être positif." },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        step={10}
                        placeholder="0.00"
                    />
                </Form.Item>

                <Form.Item
                    name="montantCharges"
                    label="Montant des charges (€)"
                    rules={[
                        { required: true, message: "Le montant des charges est obligatoire." },
                        { type: "number", min: 0, message: "Le montant doit être positif." },
                    ]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        step={10}
                        placeholder="0.00"
                    />
                </Form.Item>

                <Form.Item
                    name="dateDebut"
                    label="Date de début"
                    rules={[{ required: true, message: "La date de début est obligatoire." }]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    name="dateFin"
                    label="Date de fin"
                    rules={[{ required: true, message: "La date de fin est obligatoire." }]}
                >
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>
            </Form>
        </Modal>
    );
}