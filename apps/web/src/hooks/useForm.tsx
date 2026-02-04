import { createFormHook } from "@tanstack/react-form";

import CheckboxField from "@/components/ui/form/CheckboxField";
import DateField from "@/components/ui/form/DateField";
import FileField from "@/components/ui/form/FileField";
import NumberField from "@/components/ui/form/NumberField";
import SelectField from "@/components/ui/form/SelectField";
import TextField from "@/components/ui/form/TextField";

import { SubscribeButton } from "../components/ui/form/Button";
import { fieldContext, formContext } from "../contexts/form-context";
import TextAreaField from "@/components/ui/form/TextAreaField";

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    NumberField,
    TextField,
    FileField,
    SelectField,
    CheckboxField,
    DateField,
    TextAreaField,
  },
  formComponents: {
    SubscribeButton,
  },
});
