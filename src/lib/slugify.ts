import slugify from 'slugify';

export const textSlugify = (text: string) => {
    return slugify(text, { lower: true, strict: true });
};
