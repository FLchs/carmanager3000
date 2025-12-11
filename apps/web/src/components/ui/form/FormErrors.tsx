import * as z from "zod/v4";

export default function FormErrors({ errors }: { errors: unknown }) {
  const errorSchema = z.array(
    z.object({
      message: z.string(),
    }),
  );

  const parsedErrors = errorSchema.safeParse(errors);

  if (!parsedErrors.success) {
    return null;
  }

  return (
    <>
      {parsedErrors.data.map((error, i) => {
        return (
          <div key={i} className="text-primary">
            {error.message ?? "unknown error"}
          </div>
        );
      })}
    </>
  );
}
