import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "pt", title: "Português", type: "string" }),
    defineField({ name: "es", title: "Español", type: "string" }),
    defineField({ name: "fr", title: "Français", type: "string" }),
  ],
});
