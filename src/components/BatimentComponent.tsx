"use client";
import Batiment from "@/models/Batiment";
import Link from "next/link";
import { useState } from "react";
import { Button, Table, Tag } from "antd";
import AddBatimentComponent from "@/components/AddBatimentComponent";
import AppartementComponent from "@/components/AppartementComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function BatimentComponent({ batiments: initialBatiments }: { batiments: Batiment[] }) {
    const [batiments, setBatiments] = useState<Batiment[]>(initialBatiments);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [batimentToEdit, setBatimentToEdit] = useState<Batiment | null>(null);

    const updateBatiment = (batiment: Batiment) => {
        const isEdit = batiment.id !== undefined && batiment.id !== 0;
        const url = isEdit ? `${API_URL.batiments}${batiment.id}` : API_URL.batiments;
        const method = isEdit ? HttpService.put : HttpService.post;

        method(url, batiment).then((response) => {
            if (isEdit) {
                setBatiments(batiments.map(b => b.id === response.id ? response : b));
            } else {
                setBatiments([...batiments, response]);
            }

            setShowAddDialog(false);
            setBatimentToEdit(null);
        });
    };

    const batColumns = [
        {
            title: "Adresse",
            dataIndex: "adresse",
            key: "adresse"
        },
        {
            title: "Ville",
            dataIndex: "ville",
            key: "ville",
            render: (text: string) => <Tag color="success">{text}</Tag>
        },
        {
            title: "Actions",
            key: "action",
            render: (text: string, record: Batiment) => (
                <>
                    <Button shape="circle" onClick={() => {
                        setBatimentToEdit(record);
                        setShowAddDialog(true);
                    }}>
                        <EditOutlined />
                    </Button>
                </>
            )
        }
    ];

    return (
        <>
            <h2>Bâtiments</h2>
            <Button onClick={() => {
                setBatimentToEdit(null);
                setShowAddDialog(true);
            }}>Ajouter...</Button>
            <br />

            {showAddDialog && (
                <AddBatimentComponent
                    batiment={batimentToEdit || new Batiment()}
                    onClose={(show) => {
                        setShowAddDialog(show);
                        setBatimentToEdit(null);
                    }}
                    onSubmit={updateBatiment}
                />
            )}

            <Link href="/">
                <Button>Retour à l'accueil</Button>
            </Link>

            {!showAddDialog && (
                <Table
                    dataSource={batiments}
                    rowKey="id"
                    columns={batColumns}
                    expandable={{
                        expandedRowRender: (record: Batiment) => (
                            <AppartementComponent batimentId={record.id} />
                        )
                    }}
                />
            )}
        </>
    );
}
