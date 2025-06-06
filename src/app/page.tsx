import Link from "next/link";

export default function Home() {
  return (
    <>
        <ul>
            <li>
                <Link href={"/batiments"}>Bâtiments</Link>
                <br/>
                <Link href={'/locataire'}>Locataires</Link>
                <br/>
                <Link href={'/contrats'}>Contrats</Link>
                <br/>
                <Link href={'/appartements'}>Appartements</Link>
                <br/>
                <Link href={'/documents'}>Documents</Link>
            </li>
        </ul>
    </>
  );
}
