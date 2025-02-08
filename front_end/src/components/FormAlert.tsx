import { Alert } from "react-bootstrap";

type FormAlertProps = {
  text: any,
  variant?: any,
}

function FormAlert({ text, variant } : FormAlertProps) {
  return (
    <Alert
      className={'mt-3'}
      show={true}
      variant={variant ?? "danger"}
    >
      <div>
        {text ?? ''}
      </div>
    </Alert>
  );
}

export default FormAlert;
