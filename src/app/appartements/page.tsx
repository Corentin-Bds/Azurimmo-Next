// src/app/appartements/page.tsx
import AppartementListComponent from "@/components/AppartementListComponent";
import AppartementService from "@/services/AppartementService";

export default async function AppartementsPage() {
    const appartements = await AppartementService.getAll();

    return <AppartementListComponent appartements={appartements} />;
}