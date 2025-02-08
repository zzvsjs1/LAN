import { useNavigate } from "react-router-dom";
import NormalMessageDialog from "../pages/common/NormalMessageDialog";

type NavDialogProps = {
  path: string,
  title: string,
  body: string,
}

export default function NavDialog({ path, title, body }: NavDialogProps) {
  const navigate = useNavigate();

  return (
    <NormalMessageDialog
      callBack={() => navigate(path, {replace: true})}
      title={title}
      body={body}
    />
  );
}
