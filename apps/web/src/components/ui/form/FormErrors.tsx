import * as z from "zod/v4";

export default function FormErrors({ errors }: { errors: unknown }) {
  const errorSchema = z.array(z.string());

  const parsedErrors = errorSchema.safeParse(errors);

  if (!parsedErrors.success) {
    return <p>{JSON.stringify(errors)}</p>;
  }

  return (
    <>
      {parsedErrors.data.map((error, i) => {
        return (
          <div key={i} className="text-primary">
            {error ?? "unknown error"}
          </div>
        );
      })}
    </>
  );
}
