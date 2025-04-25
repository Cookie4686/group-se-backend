import { getCoworkingSpace } from "@/libs/coworkingSpace";
import EditCoworkingSpaceForm from "./Form";
import { auth } from "@/auth";

export default async function EditCoworkingSpace({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, auth()]);
  const coworkingSpace = await getCoworkingSpace(id, session);
  if (!coworkingSpace.data) return <main>Cannot fetch data</main>;
  if (coworkingSpace.data.privilage != "admin") return <main>No permission</main>;
  return (
    <main className="p-4">
      <h1>Edit Coworking Spaces</h1>
      <EditCoworkingSpaceForm coworkingSpace={coworkingSpace.data} />
    </main>
  );
}
