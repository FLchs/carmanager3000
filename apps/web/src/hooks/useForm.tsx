import { createFormHook } from "@tanstack/react-form";

import DateField from "@/components/ui/form/DateField";

import { SubscribeButton } from "../components/ui/form/Button";
import NumberField from "../components/ui/form/NumberField";
import TextField from "../components/ui/form/TextField";
import { fieldContext, formContext } from "../contexts/form-context";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    DateField,
    NumberField,
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
});
