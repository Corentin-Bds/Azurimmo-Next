import DocumentComponent from "@/components/DocumentComponent";
import DocumentService from "@/services/DocumentService";

export default async function DocumentsPage() {
    const documents = await DocumentService.getAll();

    return <DocumentComponent documents={documents} />;
}
