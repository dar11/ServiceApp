import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { NgLocalization } from '@angular/common';



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
  // @ViewChild('videoEl') videoElement: any;
  //   @ViewChild('videoEl', { read: ElementRef }) set videoEl(content: ElementRef) {
  //   this.videoElement = content.nativeElement;
  // }
  video: any;

  readonly VAPID_PUBLIC_KEY = "BKwgxDYxGJbZh-hyK64eejQ03_LlwZFto_4mm5Y9HhEh1F5-7ep2ZAqhHFEPapvWD2wfNGHpsh0hyxGNFQ5k7u8";

  title = 'ServiceApp';
  private peer = undefined;
  private localStream;

  private localVideo;
  private remoteVideo;

  public peerId = '';

  // targetSimplePeerpeer: any;
  // simplePeer: any;
  // n = <any>navigator;
  // public videoElement;

  constructor(private swUpdate: SwUpdate, private swPush: SwPush) { }

  ngOnInit() {
    // let video = this.videoElement;
    // let peerx: any;
    // this.n.getuserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia)
    // this.n.getUserMedia({video:true, audio:true}, (stream) => {
    //   peerx = new SimplePeer ({
    //     initiator: location.hash === '#init',
    //     trickle: false,
    //     stream:stream
    //   })

    //   peerx.on('signal', function(data) {
    //     console.log(JSON.stringify(data));

    //     this.targetSimplePeerpeer = data;
    //   })

    //   peerx.on('data', function(data) {
    //     console.log('Recieved message:' + data);
    //   })

    //   peerx.on('stream', function(stream) {
    //     video.srcObject = stream;
    //     video.play();
    //   })
    // });

    // navigator.mediaDevices.getUserMedia({video:true})
    // .then(stream => {
    //   peerx = new SimplePeer ({
    //     initiator: location.hash === '#init',
    //     trickle: false,
    //     stream:stream
    //   })

    //   peerx.on('signal', function(data) {
    //     console.log(JSON.stringify(data));

    //     this.targetSimplePeerpeer = data;
    //   })

    //   peerx.on('data', function(data) {
    //     console.log('Recieved message:' + data);
    //   })

    //   peerx.on('stream', function(stream) {
    //     video.srcObject = stream;
    //     video.play();
    //   })
    // })
    // this.simplePeer = new SimplePeer({
    //   initiator: location.hash === '#init',
    //   trickle: false
    // })

    // this.simplePeer.on('signal', (data) => {
    //   console.log(JSON.stringify(data));

    //   this.targetSimplePeerpeer = data;
    // });

    // this.simplePeer.on('data', (data) => {
    //   console.log('Received message :' + data);
    // })

    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream => {
      this.localStream = stream;
    });
  }

  // public connect() {
  //   this.simplePeer.signal(JSON.parse(this.targetSimplePeerpeer));
  // }

  // public message() {
  //   this.simplePeer.send('Hello World');
  // }

  public beReceiver() {
    if (!this.peer) {
      this.peerId = 'receiver';
      this.peer = new Peer('receiver', {
        host: location.hostname,
        port: location.port || location.protocol === 'https:' ? 443 : 80 ,
        path: '/peerjs',
        config: {
          // 'iceServers': [
          //   {url: 'stun:stun1.l.google.com:19302'}
          // ]
        },
        debug: 3});

      this.peer.on('call', call => {
        this.localVideo.srcObject = this.localStream;

        call.answer(this.localStream);

        call.on('stream', remoteStream => {
          this.remoteVideo.srcObject = remoteStream;
        });
      });
    }
  }

  public beSender() {
    if (!this.peer) {
      this.peerId = 'sender';
      this.peer = new Peer('sender', {
        host: location.hostname,
        port: location.port || location.protocol === 'https:' ? 443 : 80,
        path: '/peerjs',
        config: {
          // 'iceServers': [
          //   {url: 'stun:stun1.l.google.com:19302'}
          // ]
        },
        debug: 3});
        this.localVideo.srcObject = this.localStream;


        const call = this.peer.call('receiver', this.localStream);

        call.on('stream', remoteStream => {
          this.remoteVideo.srcObject = remoteStream;
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
