import { Injectable } from '@angular/core';


export interface InitializeAppOptions {
  [k: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }

  public initialize(options: InitializeAppOptions): Promise<void> {
    return new Promise((resolve) => {
      console.log('options => ', options);
      setTimeout(resolve, void 0, void 0);
    });
  }

}

export function initializeApp(mfService: AppService): () => Promise<void> {
  return () => mfService.initialize({});
}

export function initializeAppWithOptions(options: InitializeAppOptions) {
  return (mfService: AppService) => () => mfService.initialize(options);
}
