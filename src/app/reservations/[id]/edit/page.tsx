import { getReservation } from "@/libs/reservations";
import EditReservationForm from "./Form";

export default async function EditReservation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getReservation(id);
  if (!response.data) return <main>Cannot fetch data</main>;

  return (
    <main className="p-4">
      <h1>Edit Reservation</h1>
      <EditReservationForm reservation={response.data} />
    </main>
  );
}
