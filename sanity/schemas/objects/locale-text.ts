import { defineType, defineField } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({ name: "pt", title: "Português", type: "text", rows: 3 }),
    defineField({ name: "es", title: "Español", type: "text", rows: 3 }),
    defineField({ name: "fr", title: "Français", type: "text", rows: 3 }),
  ],
});
