import OptionButton, { ActionItem, LinkItem } from "../OptionButton";

export default function BanAppealOptionButton({
  banIssueID,
  banAppealID,
  viewInfo,
  edit,
}: {
  banIssueID: string;
  banAppealID: string;
  viewInfo?: boolean;
  edit?: {
    approve?: boolean;
    deny?: boolean;
    action: React.FormHTMLAttributes<HTMLFormElement>["action"];
    pending?: boolean;
  };
}) {
  return (
    <OptionButton>
      {viewInfo && <LinkItem href={`/banIssue/${banIssueID}/${banAppealID}`} text="View Info" />}
      {edit
        && [
          ...(edit.approve ? [{ text: "Approve", status: "resolved" }] : []),
          ...(edit.deny ? [{ text: "Deny", status: "denied" }] : []),
        ].map(({ text, status }) => (
          <ActionItem action={edit.action} key={text} pending={edit.pending}>
            <input type="text" name="id" value={banAppealID} hidden readOnly />
            <input type="text" name="status" value={status} hidden readOnly />
          </ActionItem>
        ))}
    </OptionButton>
  );
}
