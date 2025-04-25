import OptionButton, { ActionItem, LinkItem } from "../OptionButton";

export default function BanIssueOptionButton({
  id,
  viewInfo,
  appeal,
  resolve,
}: {
  id: string;
  viewInfo?: boolean;
  appeal?: boolean;
  resolve?: { action: React.FormHTMLAttributes<HTMLFormElement>["action"]; pending?: boolean };
}) {
  return (
    <OptionButton>
      {[
        ...(viewInfo ? [{ text: "View Info", href: `/banIssue/${id}` }] : []),
        ...(appeal ? [{ text: "Make an appeal", href: `/banIssue/${id}/appeal` }] : []),
      ].map(({ text, href }) => (
        <LinkItem text={text} href={href} key={text} />
      ))}
      {resolve && (
        <ActionItem action={resolve.action} text="Resolve Ban" pending={resolve.pending}>
          <input type="text" name="id" value={id} hidden readOnly />
        </ActionItem>
      )}
    </OptionButton>
  );
}
