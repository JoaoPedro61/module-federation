import { AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from './../../app.service';

@Component({
  template: ``,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultWrapperComponent implements OnInit, AfterContentInit {

  constructor(
    private readonly elRef: ElementRef<HTMLElement>,
    private readonly route: ActivatedRoute,
    private readonly service: AppService
  ) { }

  public ngOnInit(): void {
  }

  public ngAfterContentInit(): void {
    const elementName = this.route.snapshot.data['elementName'];
    const importName = this.route.snapshot.data['importName'];

    const importFn = this.service.getLoader(importName);

    console.groupCollapsed(`Rendering MicroFrontend - ${elementName}`);
    console.log('this.route.snapshot.data => ', this.route.snapshot.data);
    console.log('elementName => ', elementName);
    console.log('importName => ', importName);
    console.log('importFn => ', importFn);
    console.groupEnd();

    if (importFn) {
      importFn()
        .then(_ => console.debug(`element ${elementName} loaded!`))
        .catch(err => console.error(`error loading ${elementName}:`, err));

      const element = document.createElement(elementName);
      this.elRef.nativeElement.appendChild(element);
    }
  }

}
