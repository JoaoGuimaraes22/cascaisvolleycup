import { defineType, defineField, defineArrayMember } from "sanity";

const blockTypes = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            { name: "href", type: "url", title: "URL" },
            {
              name: "blank",
              type: "boolean",
              title: "Open in new tab",
              initialValue: true,
            },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alternative text",
      }),
    ],
  }),
];

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: blockTypes,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pt",
      title: "Português",
      type: "array",
      of: blockTypes,
    }),
    defineField({
      name: "es",
      title: "Español",
      type: "array",
      of: blockTypes,
    }),
    defineField({
      name: "fr",
      title: "Français",
      type: "array",
      of: blockTypes,
    }),
  ],
});
