import { ncp } from 'ncp';

const copyFiles = async (source: string, destination: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    ncp(source, destination, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve();
    });
  });
};

export default copyFiles;
