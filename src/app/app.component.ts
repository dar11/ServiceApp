import { Component, OnInit, ViewChild } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild('videoElement') videoElement: any;
  video: any;

  readonly VAPID_PUBLIC_KEY = "BKwgxDYxGJbZh-hyK64eejQ03_LlwZFto_4mm5Y9HhEh1F5-7ep2ZAqhHFEPapvWD2wfNGHpsh0hyxGNFQ5k7u8";

  title = 'ServiceApp';

  constructor(private swUpdate: SwUpdate, private swPush: SwPush) { }

  ngOnInit() {
    this.video = this.videoElement.nativeElement;
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }

  private addPushSubscribe(sub) {

  }

  public subscribe() {
    this.initCamera({video: true, audio:false});
    // this.swPush.requestSubscription({
    //   serverPublicKey: this.VAPID_PUBLIC_KEY
    // })
    // .then(sub => this.addPushSubscribe(sub).subscribe())
    // .catch(err => console.error("Could not subscribe to notifications", err));
  }

  private initCamera(config: any) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(config).then(stream => {
        this.video.src = stream;
        this.video.play();
      });
    }
  }
}
