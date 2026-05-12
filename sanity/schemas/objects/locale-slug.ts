import { defineType, defineField } from "sanity";

export const localeSlug = defineType({
  name: "localeSlug",
  title: "Localized slug",
  type: "object",
  description:
    "URL slug for each locale. Locales without a slug fall back to English at fetch time.",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pt",
      title: "Português",
      type: "slug",
      options: { source: "title.pt", maxLength: 96 },
    }),
    defineField({
      name: "es",
      title: "Español",
      type: "slug",
      options: { source: "title.es", maxLength: 96 },
    }),
    defineField({
      name: "fr",
      title: "Français",
      type: "slug",
      options: { source: "title.fr", maxLength: 96 },
    }),
  ],
});
