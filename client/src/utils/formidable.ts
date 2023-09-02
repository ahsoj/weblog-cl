import formidable, { IncomingForm } from 'formidable';
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';

export async function getImage(req: IncomingMessage) {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, (err: any, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
    // form.on('file', (formName, file) => resolve(file))
  });

  return data.files.image;
}

export const parseForm = async (
  req: NextApiRequest
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> => {
  return new Promise(async (resolve, reject) => {
    resolve({
      files: {},
      fields: {},
    });
  });
};
