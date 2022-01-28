import fs = require('fs');
import path = require('path');
import { Injectable } from '@nestjs/common';
import { Register, GetRemotes } from './app.service.props';

const ROOT_PATH_DATA = path.resolve(__dirname, '../');
const DATA_FILENAME = 'data.json';
const PATH_DATA = path.resolve(`${ROOT_PATH_DATA}/${DATA_FILENAME}`);
const EXISTS_FILE = fs.existsSync(PATH_DATA);

if (!EXISTS_FILE) {
  fs.writeFileSync(PATH_DATA, '{}', {
    encoding: 'utf-8',
  });
}

@Injectable()
export class AppService {
  public async register(register: Register): Promise<Register> {
    const fileDataStr = fs.readFileSync(PATH_DATA, {
      encoding: 'utf-8',
    });
    let fileData = JSON.parse(fileDataStr);

    fileData = {
      ...fileData,
      ...register,
    };

    fs.writeFileSync(PATH_DATA, JSON.stringify(fileData, void 0, 2));
    return register;
  }

  public getRemotes(remotes: GetRemotes): any {
    const fileDataStr = fs.readFileSync(PATH_DATA, {
      encoding: 'utf-8',
    });
    const fileData = JSON.parse(fileDataStr);

    const data = Object.keys(remotes)
      .reduce((arr, value) => {
        const dependencies = remotes[value];
        console.log(dependencies);
        if (fileData[value]) {
          const savedObject = fileData[value];

          if (!dependencies.includes('applications')) {
            delete savedObject['applications'];
          }
          if (!dependencies.includes('components')) {
            delete savedObject['components'];
          }
          if (!dependencies.includes('common')) {
            delete savedObject['common'];
          }

          arr.push(savedObject);
        }
        return arr;
      }, [])
      .filter((v: any) => !!v);

    return data;
  }
}
