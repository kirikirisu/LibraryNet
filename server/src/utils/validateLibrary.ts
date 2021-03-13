import { LibraryInput } from '../types';

export const validateLibrary = (input: LibraryInput) => {
  if (input.title.length < 1) {
    return [
      {
        field: 'title',
        message: 'plese input title',
      },
    ];
  }

  if (input.description.length < 5) {
    return [
      {
        field: 'description',
        message: 'length must be greater than 5',
      },
    ];
  }

  if (!input.icon.includes('http')) {
    return [
      {
        field: 'icon',
        message: 'please input image url',
      },
    ];
  }

  return null;
};
