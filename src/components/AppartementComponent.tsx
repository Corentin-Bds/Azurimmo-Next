import { useEffect, useState } from "react";
import { Table } from "antd";
import Appartement from "@/models/Appartement";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

export default function NestedAppartementTable({ batimentId }: { batimentId: number }) {
    const [appartements, setAppartements] = useState<Appartement[]>([]);

    useEffect(() => {
        HttpService.get(`${API_URL.appartementsByBatiment}${batimentId}`)
            .then(setAppartements);
    }, [batimentId]);

    const columns = [
        { title: "Numéro de l'appartement", dataIndex: "numero", key: "numero" },
        { title: "Surface en m²", dataIndex: "surface", key: "surface" },
        { title: "Nombre de Pièces", dataIndex: "nbrPiece", key: "nbrPiece" },
        { title: "Description de l'appartement", dataIndex: "description", key: "description" }
    ];

    return (
        <Table
            dataSource={appartements}
            rowKey="id"
            columns={columns}
            pagination={false}
        />
    );
}