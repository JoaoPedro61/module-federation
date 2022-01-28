export interface Application {
  name: string;
  pathName: string;
  exposedFile: string;
  remoteEntry: string;
  exposedModule: string;
  exposedNgModule: string;
}

export interface Components {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  exposedFile: string;
}

export interface Common {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  exposedFile: string;
}

export interface Register {
  [base: string]: {
    name: string;
    filename: string;
    remoteEntry: string;
    remoteUrl: string;

    applications: Application[];
    components: Components[];
    common: Common[];
  };
}

export interface GetRemotes {
  [base: string]: string[];
}
