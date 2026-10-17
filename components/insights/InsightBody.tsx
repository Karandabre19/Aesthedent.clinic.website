import type { ReactNode } from "react";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { InsightBody as Body } from "../../sanity/lib/insight-mapping";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    lead: ({ children }) => <p className="lead">{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }: { children?: ReactNode; value?: { href: string } }) => <a href={value?.href}>{children}</a>,
  },
  list: { bullet: ({ children }) => <ul>{children}</ul>, number: ({ children }) => <ol>{children}</ol> },
  listItem: { bullet: ({ children }) => <li>{children}</li>, number: ({ children }) => <li>{children}</li> },
};

export default function InsightBody({ value }: { value: Body }) {
  return <PortableText value={value} components={components} />;
}
