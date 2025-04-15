import { Avatar, AvatarProps } from "@mui/material";

export default function AvatarIcon({ props, name }: { props?: AvatarProps; name?: string }) {
  function stringToColor(string: string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  return (
    <Avatar {...props} sx={{ ...props?.sx, bgcolor: name ? stringToColor(name) : undefined }}>
      {name && <span>{name.charAt(0).toUpperCase()}</span>}
    </Avatar>
  );
}
