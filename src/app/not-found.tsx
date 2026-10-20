import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main" className="grid-lines frame flex min-h-[70dvh] flex-col justify-center py-24">
      <p className="label text-accent">Error 404 · File not found</p>
      <h1 className="mt-5 measure text-headline">This drawer is empty, or the file was never catalogued.</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="primary">
          Return to the entrance
        </ButtonLink>
        <ButtonLink href="/museum">Visit the museum</ButtonLink>
      </div>
    </main>
  );
}
