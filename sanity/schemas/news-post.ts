import { defineType, defineField } from "sanity";

export const newsPost = defineType({
  name: "newsPost",
  title: "News post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "localeText",
      description: "Used on the news card and as the SEO meta description.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "localeSlug",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Hero image alt text",
      type: "localeString",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localeBlockContent",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      name: "publishedAtDesc",
      title: "Published (newest first)",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title.en", media: "image", date: "publishedAt" },
    prepare: ({ title, media, date }) => ({
      title: title || "Untitled",
      subtitle: typeof date === "string" ? date.slice(0, 10) : "",
      media,
    }),
  },
});
