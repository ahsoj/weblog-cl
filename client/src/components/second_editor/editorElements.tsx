const CodeElement: React.FC<any> = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const LeafElement: React.FC<any> = (props) => {
  const leaf = props.leaf;
  let children = props.children;
  if (leaf.code) {
    children = <code className="text-lg">{children}</code>;
  }
  if (leaf.bold) {
    children = <strong className="text-lg">{children}</strong>;
  }
  if (leaf.italic) {
    children = <em className="text-lg">{children}</em>;
  }
  if (leaf.underlined) {
    children = <u className="text-lg">{children}</u>;
  }
  return <span {...props.attributes}>{children}</span>;
};

const Element: React.FC<any> = (props) => {
  const style = { textAlign: props.element.align };
  switch (props.element.type) {
    case 'block-quote': {
      return (
        <blockquote
          className="pl-4 text-lg border-r-4 border-gray-600 italic"
          style={style}
          {...props.attributes}
        >
          {props.children}
        </blockquote>
      );
    }
    case 'bulleted-list': {
      return (
        <ul className="text-lg" style={style} {...props.attributes}>
          {props.children}
        </ul>
      );
    }
    case 'heading-one': {
      return (
        <h1 className="text-4xl" style={style} {...props.attributes}>
          {props.children}
        </h1>
      );
    }
    case 'heading-two':
      return (
        <h2 className="text-3xl" style={style} {...props.attributes}>
          {props.children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 className="text-2xl" style={style} {...props.attributes}>
          {props.children}
        </h3>
      );
    case 'list-item':
      return (
        <li className="text-lg" style={style} {...props.attributes}>
          {props.children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol className="text-lg" style={style} {...props.attributes}>
          {props.children}
        </ol>
      );
    case 'link': {
      return (
        <a
          href={props.url}
          style={style}
          className="text-lg"
          {...props.attributes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.children}
        </a>
      );
    }
    case 'code': {
      return (
        <pre className="text-lg" {...props.attributes}>
          <code className="text-lg">{props.children}</code>
        </pre>
      );
    }
    case 'image':
      return <img src={props.url} {...props.attributes} alt="" />;
    default:
      return (
        <p className="text-lg" style={style} {...props.attributes}>
          {props.children}
        </p>
      );
  }
};

export default Object.assign(Element, {
  Leaf: LeafElement,
});
