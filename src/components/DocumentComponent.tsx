"use client";

import { useState } from "react";
import { Button, Table, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Document from "@/models/Document";
import DocumentService from "@/services/DocumentService";
import AddDocumentComponent from "@/components/AddDocumentComponent";
import Link from "next/link";

export default function DocumentComponent({ documents: initialDocuments }: { documents: Document[] }) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [showDialog, setShowDialog] = useState(false);
    const [documentToEdit, setDocumentToEdit] = useState<Document | null>(null);

    const handleSubmit = async (doc: Document) => {
        try {
            const isEdit = !!doc.id;
            let updated;
            if (isEdit) {
                updated = await DocumentService.update(doc.id, doc);
                setDocuments(documents.map((d) => (d.id === updated.id ? updated : d)));
                message.success("Document modifié.");
            } else {
                updated = await DocumentService.create(doc);
                setDocuments([...documents, updated]);
                message.success("Document ajouté.");
            }
            setShowDialog(false);
            setDocumentToEdit(null);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors de l'enregistrement.");
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await DocumentService.delete(id);
            setDocuments(documents.filter((d) => d.id !== id));
            message.success("Document supprimé.");
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
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "URL",
            dataIndex: "url",
            key: "url",
            render: (url: string) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Document) => (
                <>
                    <Button
                        shape="circle"
                        onClick={() => {
                            setDocumentToEdit(record);
                            setShowDialog(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                        shape="circle"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        <DeleteOutlined />
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">Documents</h2>

            <Button
                type="primary"
                className="mb-4"
                onClick={() => {
                    setDocumentToEdit(null);
                    setShowDialog(true);
                }}
            >
                Ajouter un document
            </Button>

            {showDialog && (
                <AddDocumentComponent
                    document={
                        documentToEdit || {
                            id: 0,
                            nom: "",
                            url: "",
                            description: "",
                        }
                    }
                    onClose={() => {
                        setShowDialog(false);
                        setDocumentToEdit(null);
                    }}
                    onSubmit={handleSubmit}
                />
            )}

            <Table dataSource={documents} rowKey="id" columns={columns} />

            <div className="mt-4">
                <Link href="/">
                    <Button>Retour à l'accueil</Button>
                </Link>
            </div>
        </>
    );
}
