import { Schema, arrayOf } from 'normalizr';

const importedEventSchema = new Schema('importedEvents', { idAttribute: 'fbid' });
const categorySchema = new Schema('categories');

importedEventSchema.define({
  categories: arrayOf(categorySchema)
});

const Schemas = {
  IMPORTED_EVENT: importedEventSchema,
  IMPORTED_EVENT_ARRAY: arrayOf(importedEventSchema),
  CATEGORY: categorySchema,
  CATEGORY_ARRAY: arrayOf(categorySchema),
};

export default Schemas;
