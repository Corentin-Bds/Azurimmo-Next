"use client";

import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import Document from "@/models/Document";

interface Props {
    document: Document;
    onClose: () => void;
    onSubmit: (document: Document) => void;
}

export default function AddDocumentComponent({ document, onClose, onSubmit }: Props) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(document);
    }, [form, document]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const updated: Document = { ...document, ...values };
                onSubmit(updated);
            })
            .catch(() => {});
    };

    return (
        <Modal
            title={document.id ? "Modifier le document" : "Ajouter un document"}
            open={true}
            onCancel={onClose}
            onOk={handleOk}
            okText="Valider"
            cancelText="Annuler"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Le nom est obligatoire." }]}> 
                    <Input />
                </Form.Item>
                <Form.Item name="url" label="URL" rules={[{ required: true, message: "L'URL est obligatoire." }]}> 
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
