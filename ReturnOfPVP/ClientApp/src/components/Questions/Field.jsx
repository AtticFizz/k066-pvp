import { useField, Field as FField } from "formik";
import { Col, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import RequiredLabel from "../RequiredLabel";

export default function Field({
  name,
  type,
  label,
  as,
  children,
  required,
  inputProps,
}) {
  const [field, meta, helpers] = useField(name);
  const Component = as || Input;
  const FLabel = required ? RequiredLabel : Label;

  const fieldProps = inputProps ? { ...field, ...inputProps } : { ...field };
  return (
    <FormGroup row>
      <FLabel sm={2} for={name}>
        {label}
      </FLabel>
      <Col sm={10}>
        <Component
          id={name}
          invalid={!!meta.error}
          style={inputProps?.style}
          type={type}
          {...fieldProps}
        >
          {children}
        </Component>
        {/* {required && <FormFeedback>{meta.error}</FormFeedback>} */}
        <FormFeedback>{meta.error}</FormFeedback>
      </Col>
    </FormGroup>
  );
}
