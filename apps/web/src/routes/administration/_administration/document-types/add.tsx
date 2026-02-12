import Header from "#/components/ui/Header";
import { useToast } from "#/hooks/useToast";
import { useAppForm } from "#/hooks/useForm";
import { openapi } from "#/lib/openapi";
import { slugify } from "#/utils/slugify";
import { createDocumentTypeSchema } from "@cm3k/validation";
import { isDefinedError } from "@orpc/client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/administration/_administration/document-types/add")({
  component: RouteComponent,
  staticData: {
    getTitle: () => "Add",
  },
});

function RouteComponent() {
  const router = useRouter();
  const client = useQueryClient();
  const { pushToast } = useToast();

  const { mutate: createDocumentType } = useMutation(
    openapi.documentTypes.create.mutationOptions({
      onError: async (error) => {
        if (isDefinedError(error) && error.code === "INPUT_VALIDATION_FAILED") {
          form.setErrorMap({
            onSubmit: {
              fields: error.data.fieldErrors,
            },
          });
        }
      },
      onSuccess: async () => {
        pushToast({ content: "New document type created.", type: "success" });
        void client.invalidateQueries({
          queryKey: openapi.documentTypes.list.key(),
        });
        router.history.back();
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: createDocumentTypeSchema,
    },
    onSubmit: ({ value }) => {
      createDocumentType(value);
    },
  });

  return (
    <>
      <Header />
      <h1 className="my-2 text-lg font-bold">Create new document type</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="grid max-w-150 gap-4"
      >
        <form.AppField
          name="name"
          listeners={{
            onChange: ({ value, fieldApi }) => {
              if (fieldApi.form.getFieldMeta("slug")?.isPristine) {
                fieldApi.form.setFieldValue("slug", slugify(value), {
                  dontUpdateMeta: true,
                });
              }
            },
          }}
        >
          {(field) => (
            <>
              <field.TextField label="Name" required />
            </>
          )}
        </form.AppField>
        <form.AppField name="slug">
          {(field) => (
            <>
              <field.TextField label="Slug" required />
            </>
          )}
        </form.AppField>
        <form.AppForm>
          <p className="ml-auto text-sm text-text-muted">
            fields marked <span className="text-primary">*</span> are required
          </p>
          <div className="flex flex-row justify-end gap-4">
            <form.SubscribeButton
              callback={() => console.log("close")}
              type="button"
              variant="secondary_outline"
            >
              Cancel
            </form.SubscribeButton>
            <form.SubscribeButton type="submit">Save</form.SubscribeButton>
          </div>
        </form.AppForm>
      </form>
    </>
  );
}
