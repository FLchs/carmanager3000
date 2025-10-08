import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";

import { SubscribeButton } from "../components/ui/form/Button";
import NumberField from "../components/ui/form/NumberField";
import { fieldContext, formContext } from "../contexts/form-context";

const TextField = lazy(() => import("../components/ui/form/TextField"));

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NumberField,
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
});
