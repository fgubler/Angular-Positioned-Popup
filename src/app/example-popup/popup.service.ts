import {Injectable, Injector} from '@angular/core';
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {IPopupData, POPUP_DATA} from "./popup-data";
import {ComponentPortal, PortalInjector} from "@angular/cdk/portal";
import {ExamplePopupComponent} from "./example-popup.component";

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}

  public openOverlay<T>(data: IPopupData) {
    const overlayRef = this.overlay.create({ minHeight: '100%', minWidth: '100%' });
    const injector = this._createInjector(overlayRef, data);
    const portal = new ComponentPortal(ExamplePopupComponent, null, injector);
    overlayRef.attach(portal);
  }

  private _createInjector(overlayRef: OverlayRef, data: IPopupData) {
    const injectionTokens = new WeakMap();
    injectionTokens.set(OverlayRef, overlayRef);
    injectionTokens.set(POPUP_DATA, data);
    return new PortalInjector(this.injector, injectionTokens);
  }
}
