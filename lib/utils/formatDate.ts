export async function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}
