import { Component, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  readonly VAPID_PUBLIC_KEY = "BKwgxDYxGJbZh-hyK64eejQ03_LlwZFto_4mm5Y9HhEh1F5-7ep2ZAqhHFEPapvWD2wfNGHpsh0hyxGNFQ5k7u8";

  title = 'ServiceApp';

  constructor(private swUpdate: SwUpdate, private swPush: SwPush) { }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }

  public subscribe() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    });
  }
}
