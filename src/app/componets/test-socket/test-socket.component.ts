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
 imageCapture:any;

  constructor(
    private sanitizer: DomSanitizer
  ) {
  }
  
  ngOnInit(): void {
    //  this.socket = io('http://192.168.0.9:8080/');
    this.socket = io('http://45.141.26.73:3030/');
     
    this.socket.on('getHistoryBox', (res:any) => {
      this.messageBox = res;
    })

    this.socket.on('casting', (base64:any) => {
      console.log(typeof(base64));
      
      console.log(base64);
      
      this.imageCapture = "data:image/png;base64, " + base64;
    })
    
      this.socket.on('messageBox', (res:any) => {
      this.url = res.message.includes('http') ? res.message : '';
      this.socket.emit("insertHistory", {"message": res.timeStramp + " " + "[" + res.username + "] " + res.message});
      this.messageBox.push({"message": res.timeStramp + " " + "[" + res.username + "] " + res.message})
      // this.socket.emit
      setTimeout(()=> {
        const element:any = document.getElementById('chat');  
        element.scrollTop = element.scrollHeight
      },500)
    })

    setInterval(() => {
      const timeNow = Date.now()
      this.socket.emit("count", timeNow);
    }, 1000);    
    
    this.socket.on('count', (res:any) => {
      const duration = Date.now() - res;
      this.showCount = duration;
    })

  }

  

  detectVideoUrl() {
    // const types = new Map([["jpg", "img"], ["gif", "img"], ["mp4", "video"], ["3gp", "video"]])

    // const url = new URL("http://example.com/image.jpg")
    // const extension = url.pathname.split(".")[1]
    
    // const element = document.createElement(types.get(extension))
  }

  onClickSubmit(res:any) {
    var data = {
      "username": res.username,
      "message": res.message,
      "schedule": res.datetime,
      "timeStramp": this.getDateTime()
    }
    console.log(data);
    this.socket.emit("message", data);
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
 

  getDateTime():any {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return dd + '-' + mm +'-'+ yyyy
  }

  timeToSchedule(date:any) {
      
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
