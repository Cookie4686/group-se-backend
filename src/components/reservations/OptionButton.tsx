import OptionButton, { ActionItem, LinkItem } from "../OptionButton";

export default function ReservationOptionButton({
  id,
  view,
  edit,
  deleteOption,
}: {
  id: string;
  view?: boolean;
  edit?: {
    cancel?: boolean;
    approve?: boolean;
    reject?: boolean;
    action: React.FormHTMLAttributes<HTMLFormElement>["action"];
    pending?: boolean;
  };
  deleteOption?: { action?: React.FormHTMLAttributes<HTMLFormElement>["action"]; pending?: boolean };
}) {
  return (
    <OptionButton>
      {view && <LinkItem text="View Info" href={`/reservations/${id}`} />}
      {edit
        && [
          ...(edit.cancel ? [{ text: "Cancel", status: "canceled" }] : []),
          ...(edit.approve ? [{ text: "Approve", status: "approved" }] : []),
          ...(edit.reject ? [{ text: "Reject", status: "rejected" }] : []),
        ].map(({ text, status }) => (
          <ActionItem action={edit.action} text={text} pending={edit.pending} key={text}>
            <input type="text" name="id" value={id} hidden readOnly />
            {status && <input type="text" name="approvalStatus" value={status} hidden readOnly />}
          </ActionItem>
        ))}
      {deleteOption && (
        <ActionItem action={deleteOption.action} text="Delete" pending={deleteOption.pending}>
          <input type="text" name="id" value={id} hidden readOnly />
        </ActionItem>
      )}
    </OptionButton>
  );
}
