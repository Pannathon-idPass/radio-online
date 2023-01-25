import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-test-socket',
  templateUrl: './test-socket.component.html',
  styleUrls: ['./test-socket.component.scss']
})
export class TestSocketComponent implements OnInit {
 socket: any;
 url: any;
 urlCache = new Map<string, SafeResourceUrl>();

 playerSrc:any;
 messageBox:any = [];
 showCount:any;
 
  constructor(
    private sanitizer: DomSanitizer
  ) {
  }
  
  ngOnInit(): void {
    // this.socket = io('http://localhost:3000/');
    this.socket = io('https://448ce46435d305.lhr.life');

    this.socket.on('messageBox', (res:any) => {
      this.url = res.message.includes('http') ? res.message : '';
      this.messageBox.push({"message": "[" + res.username + "] " + res.message})
      // var vid = document.getElementById("video").current;
      console.log(this.messageBox);
      
    })

    this.socket.on('count', (res:any) => {
      this.showCount = res;
    })

  }

  detectVideoUrl() {
    // const types = new Map([["jpg", "img"], ["gif", "img"], ["mp4", "video"], ["3gp", "video"]])

    // const url = new URL("http://example.com/image.jpg")
    // const extension = url.pathname.split(".")[1]
    
    // const element = document.createElement(types.get(extension))
  }

  onClickSubmit(res:any) {
    console.log(res);
    var data = {
      "username": res.username,
      "message": res.message,
      "currentTime": res.currentTime
    }
    this.socket.emit("message",data);
  }

  urlSanitizer(url:string):SafeResourceUrl{
    var videoId = this.getVideoId(url)    
    var urc = this.urlCache.get(videoId);
    if (!urc) {
      urc = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&autoplay=1");
      this.urlCache.set(videoId, urc);
    }
    return urc;
   
  //  const url = this.domSanitizer.sanitize(SecurityContext.URL, url.toString());
  //  this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(url);

  }

  getVideoId(url:string) {
    if(url.includes("youtu.be")) {
      var youtubeId =  url.replace('https://youtu.be/','')
      return youtubeId
    }
    return ''
  }


  // getIframeYouTubeUrl(videoId: string): SafeResourceUrl {
  //   const url = this.urlCache.get(videoId);
  //   if (!url) {
  //     url = this.domSanitizer.bypassSecurityTrustResourceUrl(
  //       "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1");;
  //     this.urlCache.set(videoId, url);
  //   }
  //   return url;
  // }

}
