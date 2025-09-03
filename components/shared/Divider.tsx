function Divider({ text }: { text?: string }) {
  return (
    <div className="my-12 flex items-center">
      <div className="bg-foreground/20 h-0.5 flex-1 dark:bg-neutral-600/40" />
      {text && (
        <span className="text-muted-foreground mx-4 text-sm font-medium whitespace-nowrap">
          {text}
        </span>
      )}
      <div className="bg-foreground/20 h-0.5 flex-1 dark:bg-neutral-600/40" />
    </div>
  );
}

export default Divider;
