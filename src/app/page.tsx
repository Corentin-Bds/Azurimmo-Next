import Link from "next/link";

export default function Home() {
  return (
    <>
        <ul>
            <li>
                <Link href={"/batiments"}>Bâtiments</Link>
            </li>
        </ul>
    </>
  );
}
