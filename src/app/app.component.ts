import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
// import * as Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('local', { read: ElementRef }) set localVideoElement(content: ElementRef) {
    this.localVideo = content.nativeElement;
  }

  @ViewChild('remote', { read: ElementRef }) set remoteVideoElement(content: ElementRef) {
    this.remoteVideo = content.nativeElement;
  }
  // @ViewChild('videoElement') videoElement: any;
  video: any;

  readonly VAPID_PUBLIC_KEY = "BKwgxDYxGJbZh-hyK64eejQ03_LlwZFto_4mm5Y9HhEh1F5-7ep2ZAqhHFEPapvWD2wfNGHpsh0hyxGNFQ5k7u8";

  title = 'ServiceApp';
  private peer = undefined;
  private localStream;

  private localVideo;
  private remoteVideo;

  constructor(private swUpdate: SwUpdate, private swPush: SwPush) { }

  ngOnInit() {
    // this.startChat();
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }

  public beReceiver() {
    if (!this.peer) {
      this.peer = new Peer('receiver', {host: 'localhost', port: 9000, path: `/`});

      // this.peer.on('connection', (conn) => {
      //   conn.on('data', (data) => {
      //     console.log(data);
      //   });
      // });

      this.peer.on('call', call => {
        this.localStream = navigator.mediaDevices.getUserMedia({
          video: true
        })
        .then((stream) => {
          this.localStream = stream;
          this.localVideo.srcObject = this.localStream;

          call.answer(this.localStream);

          call.on('stream', remoteStream => {
            this.remoteVideo.srcObject = remoteStream;
          });
        });
      });
    }
  }

  public beSender() {
    if (!this.peer) {

      this.peer = new Peer('sender', {host: 'localhost', port: 9000, path: `/`});

      navigator.mediaDevices.getUserMedia({
        video: true
      })
      .then((stream) => {
        this.localStream = stream;
        console.log(this.localVideo);
        console.log(this.localStream);
        this.localVideo.srcObject = this.localStream;


        const call = this.peer.call('receiver', this.localStream);

        call.on('stream', remoteStream => {
          this.remoteVideo.srcObject = remoteStream;
        });
      });

    }
  }

  ngAfterViewInit() {
    // this.video = this.videoElement.nativeElement;
  }

  private addPushSubscribe(sub) {

  }

  private startChat() {
    this.localStream = navigator.mediaDevices.getUserMedia({
      video: true
    });

    this.localVideo.srcObject = this.localStream;
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
