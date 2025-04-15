import { getCoworkingSpace } from "@/libs/coworkingSpace";
import EditCoworkingSpaceForm from "./Form";

export default async function EditCoworkingSpace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coworkingSpace = await getCoworkingSpace(id);
  if (!coworkingSpace.data) return <main>Cannot fetch data</main>;
  return (
    <main className="p-4">
      <h1>Edit Coworking Spaces</h1>
      <EditCoworkingSpaceForm coworkingSpace={coworkingSpace.data} />
    </main>
  );
}
