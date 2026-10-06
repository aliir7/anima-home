import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProductDescriptionProps = {
  content: string;
};

function ProductDescription({ content }: ProductDescriptionProps) {
  if (!content.trim()) return null;

  return (
    <section className="mt-12">
      <div className="border-border border-t pt-8">
        <h2 className="text-primary mb-6 text-xl font-bold dark:text-neutral-900">
          توضیحات محصول
        </h2>

        <div
          dir="rtl"
          className="text-muted-foreground max-w-4xl text-sm leading-8"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h2 className="text-foreground mt-8 mb-5 text-2xl leading-10 font-bold dark:text-neutral-800">
                  {children}
                </h2>
              ),

              h2: ({ children }) => (
                <h3 className="text-foreground mt-8 mb-4 text-xl leading-9 font-bold dark:text-neutral-700">
                  {children}
                </h3>
              ),

              h3: ({ children }) => (
                <h4 className="text-foreground mt-6 mb-3 text-lg leading-8 font-bold dark:text-neutral-700">
                  {children}
                </h4>
              ),

              p: ({ children }) => (
                <p className="mb-5 leading-8 dark:text-neutral-600">
                  {children}
                </p>
              ),

              strong: ({ children }) => (
                <strong className="text-foreground font-bold dark:text-neutral-600">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="text-foreground/90 italic dark:text-neutral-600">
                  {children}
                </em>
              ),

              ul: ({ children }) => (
                <ul className="my-5 list-disc space-y-2 pe-6 dark:text-neutral-600">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="my-5 list-decimal space-y-2 pe-6 dark:text-neutral-600">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="ps-1 leading-8 dark:text-neutral-600">
                  {children}
                </li>
              ),

              blockquote: ({ children }) => (
                <blockquote className="border-primary bg-muted/50 text-foreground my-6 rounded-e-lg border-e-4 px-5 py-3 dark:text-neutral-600">
                  {children}
                </blockquote>
              ),

              code: ({ children }) => (
                <code className="bg-muted text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em] dark:text-neutral-600">
                  {children}
                </code>
              ),

              pre: ({ children }) => (
                <pre className="bg-muted text-foreground my-6 overflow-x-auto rounded-xl border p-4 text-sm leading-7 dark:text-neutral-600">
                  {children}
                </pre>
              ),

              hr: () => <hr className="border-border my-8" />,

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary decoration-primary/40 hover:decoration-primary font-medium underline underline-offset-4 transition-colors"
                >
                  {children}
                </a>
              ),

              table: ({ children }) => (
                <div className="my-6 overflow-x-auto rounded-xl border">
                  <table className="w-full border-collapse text-sm">
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead className="bg-muted text-foreground">{children}</thead>
              ),

              th: ({ children }) => (
                <th className="border-border border-b px-4 py-3 text-right font-bold">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="border-border border-b px-4 py-3">{children}</td>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

export default ProductDescription;
