export default function HtmlDiv({ value, ...rest }) {
  return <div dangerouslySetInnerHTML={{ __html: value }} {...rest} />;
}
