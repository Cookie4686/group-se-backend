import OptionButton, { ActionItem, LinkItem } from "../OptionButton";
import { deleteCoworkingSpace } from "@/libs/coworkingSpace";

export default function CoworkingSpaceOptionButton({
  id,
  viewInfo,
  viewReserve,
  edit,
  deleteOption,
}: {
  id: string;
  viewInfo?: boolean;
  viewReserve?: boolean;
  edit?: boolean;
  deleteOption?: boolean;
}) {
  return (
    <OptionButton>
      {[
        ...(viewInfo ? [{ text: "View Info", href: `/coworking-space/${id}` }] : []),
        ...(viewReserve ? [{ text: "View Reservations", href: `/coworking-space/${id}/reservations` }] : []),
        ...(edit ? [{ text: "Edit", href: `/coworking-space/${id}/edit` }] : []),
      ].map(({ text, href }) => (
        <LinkItem text={text} href={href} key={text} />
      ))}
      {deleteOption && (
        <ActionItem
          action={async () => {
            "use server";
            await deleteCoworkingSpace(id);
          }}
          text="Delete"
        />
      )}
    </OptionButton>
  );
}
