import React, { Component } from "react";
import {
  Page,
  Navbar,
  BlockTitle,
  Block,
  List,
  ListItem,
  Icon,
  NavLeft,
  NavRight,
  NavTitle,
  Link,
  Button,
  Popover,
  Tab, 
  Tabs,
  Toolbar,
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from "framework7-react";
import { Dialogs } from "@ionic-native/dialogs";
import { ReactMic } from 'react-mic';

import Platform from "../../services/Platform";
import * as config from "../../config";

import ebaniyEnot from '../../assets/img/raccoon.svg'
import sos from '../../assets/img/sos.svg'
import alberto from '../../assets/img/alberto.png'
import bird from '../../assets/img/bird.png'
import eco from '../../assets/img/eco.svg'

import add from '../../assets/img/add.svg'
import feed from '../../assets/img/feed.svg'
import info from '../../assets/img/info.svg'


export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      record: false,
      time: 0
    }

    this.platform = Platform;
    this.dialogs = Dialogs;
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.start = this.start.bind(this);
    this.makeLink = this.makeLink.bind(this);
  }

  componentDidMount() {

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    function success(pos) {
      var crd = pos.coords;
    
      console.log('Ваше текущее метоположение:');
      console.log(`Широта: ${crd.latitude}`);
      console.log(`Долгота: ${crd.longitude}`);
      console.log(`Плюс-минус ${crd.accuracy} метров.`);
    };
    
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };
    
    navigator.geolocation.getCurrentPosition(success, error, options);
    

    this.platform.registerBackButtonAction(event => {
      event.preventDefault();

      this.dialogs
        .confirm("Do you want to close the application ?", config.name, [
          "Close",
          "No"
        ])
        .then(index => {
          if (index === 1) {
            this.platform.exitApp();
          }
        });

      return false;
    }, 101);
  }

  startRecording(){
    this.setState({
      record: true
    });
  }
 
  stopRecording(){
    this.setState({
      record: false
    });
  }
 
  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }
 
  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
    fetch("https://corsanywhere.herokuapp.com/https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general&folderId=b1ga1o49bvnq6ti62c02&lang=en-US", {
      body: data,
      headers: {
        Authorization: "Bearer CggVAgAAABoBMxKABEszBi0jxGYV5Q6gzmn0pjSvqHCXFV9aTyB3YzANIjLo0pfcq96eYuetQEJQ3BNGpaskzoHplbmRiadp4xylUOvhwckX9oj0R1QfhPJFThtH-qPD7lPbjpbSRtJrwkw0dQhZoX8xlzuefXd9n3wTfMeFOj6af2HtACfolgCAFJRW_G4Tb9ZNEYoz4SmDqFTYW3k7uKBmNc7ruOkXszefzh1-BEJfnBxQF07U5Cgj7z-5ypoJ_jAAy2mNNPBj7BiK-iTWms0Q3c8odLrNLNH70rVueHPWnvcQF8Ojp_73Bu45jzA03mBEeEu_nf9cum93luGyVNPIdPNRC1yk13mqjLF0BXP8-G4CXU5kH9QuB6v52I00PlKnjqIUGVyghsgy6AHzZxQjk5E4Swj6Sm35YIjYiuvJfFiSC_Lba5nMdNqhMu2AlLMWAw2sfO7X63iHJba7UQ2s6Hww-SQEa0kXLAsqUIXxcT5NXSZUN4uK9A7rLQVBSzHEwL87YbjdR8PXoFvWrKGlK2hvzLUGYbe9nJI8bvqDLobhmD_04wWBOxqaYZ29QrfvV2P4bcWmQvbsOpVfqc292QKheJWO0TkxM7hNQfXLrjoDe4I8hoz6ASekmFhMCT6kQCUrM83iyTgRhePfE6c18fNWQwjidNWOvNawy-4GHr7BVMvPijQGA9DWGiQQ0ebA7gUYkbjD7gUiFgoUYWplaW42am1hcGxnY3N1M2liN2o=",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    .then(response => response.json())
    .then(console.log)
    .catch(err => console.log(err))
  }

  start(e){
    var {log} = console;
    var id = val => document.getElementById(val),
    ul = id('ul'),
    gUMbtn = id('gUMbtn'),
    start = id('start'),
    stop = id('stop'),
    stream,
    recorder,
    counter=1,
    chunks = [],
    media
    let mv = id('mediaVideo'),
      mediaOptions = {
        video: {
          tag: 'video',
          type: 'video/webm',
          ext: '.mp4',
          gUM: {video: true, audio: true}
        },
        audio: {
          tag: 'audio',
          type: 'audio/ogg',
          ext: '.ogg',
          gUM: {audio: true}
        }
      };
    media = mediaOptions.audio;
    var self = this;
    navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
      stream = _stream;
      // id('gUMArea').style.display = 'none';
      // id('btns').style.display = 'inherit';
      // start.removeAttribute('disabled');
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        chunks.push(e.data);
        if(recorder.state == 'inactive')  this.makeLink(chunks, media);
      };
      log('got media successfully');
      chunks=[];
      recorder.start();
      self.setState({record: true})
      var timer = setInterval(() => {
        if(self.state.time < 5){
          self.setState({
            time: self.state.time + 1
          });
        }else{
          self.setState({record: false, time: 0})
          clearInterval(timer);
        }
      }, 1000);
      setTimeout(() => {
        recorder.stop();
      }, 3000);
    }).catch(log);
  }

  makeLink(chunks, media){
    let blob = new Blob(chunks, {type: media.type })
      , url = URL.createObjectURL(blob)
      , li = document.createElement('li')
      , mt = document.createElement(media.tag)
      , hf = document.createElement('a')
    ;
    console.log(blob);
    fetch("https://corsanywhere.herokuapp.com/https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?topic=general&folderId=b1ga1o49bvnq6ti62c02&lang=en-US", {
      body: blob,
      headers: {
        Authorization: "Bearer CggVAgAAABoBMxKABKi553278lwc9cZ4rV8v5ijQoWoM4BaFVv_aLKd43Erdqrs5EfgbrAeQGg8MFBmQ_1alA6--0s1KmuF1MQhKG_utQs32G7burfQ0teDl72-EPmDb6ByIaKLhpbwmny2hsLQq4xXeRoTfwvxZzFW5BeVBBixNCJLX6ccwGyDZ3ECKgqFxzXlSoTKNnbKdXTHGIoRslBJAeo5zIEbgratrCIM2BTn6RK8QqMpudrMVqduq_9pMstiRwT8yUaSIYTegktVrGbkBJem49A4mMnyQjqdYAwt4OgGjh99IZ9aUm06USMeW3XgphJrWsxYZcGreOsqEPlxW3nIgswW1u62tnlQ9WYuGEilicXIDh7zdpswU4AeMvT42SZ5v9Cg_sRT9yDBoivLK34X_9apm07YbuTJ7zdb9UNRvmuuSu9qbLKoeeEy4IB4937fvL3geGqERBBlZqUI7ZgHVYTT5IeDblR7AJ_hZ5cTOYyYKQE-ZlXWXjNW3sEO8VHExfe07QJ7YNrRIhnTsd266nMkgESpAaWJpdpRgxnIIURf3ZbT3F-SFQj6bhbu2YvSel1gKPQ2_a6x4-AflLKFTLGMo4v7KUo-H1Zg9BlXpdv_zasYdqOSpWumxI-N4Y_4s1YkQETrsOIU54XE6astALyH38g1zH8v2MeD5Gg0jk2crFyhFhnGPGiQQtJfE7gUY9OjG7gUiFgoUYWplaW42am1hcGxnY3N1M2liN2o=",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    .then(response => response.json())
    .then(console.log)
    .catch(err => console.log(err))
    // mt.controls = true;
    // mt.src = url;
    // hf.href = url;
    // hf.download = `${media.ext}`;
    // hf.innerHTML = `donwload ${hf.download}`;
    // li.appendChild(mt);
    // li.appendChild(hf);
    // ul.appendChild(li);
  }
  

  render() {
    return (
      <Page pageContent={false}>
        <Navbar>
          <div style={{
            display: "flex",  
          }}>
            <img style={{
              marginLeft: 20
            }} src={eco} alt=""/>
            <p 
              style={{
                color:"black",
                marginLeft: 20,
                fontSize: "13px"
              }}
            >Fighting for the life of animals</p>
          </div>
        </Navbar>
        <Toolbar labels tabbar bottom>
          <Link style={{
            color: "black",
            fontSize: "12px"
          }} tabLink="#tab-2"><img width="30px" src={feed} alt=""/></Link>
          <Link style={{
            color: "black",
            fontSize: "12px"
          }} tabLink="#tab-1"><img width="35px" src={add} alt=""/></Link>
          <Link style={{
            color: "black",
            fontSize: "12px"
          }} tabLink="#tab-3"><img width="30px" src={info} alt=""/></Link>
        </Toolbar>
        <Tabs>
          <Tab id="tab-1" className="page-content">
            <center>
              <p style={{
                fontSize: "18px",
                fontWeight: "500"
              }}>For call tap on the button</p>
              <br/>
              {this.state.record && <h1>Call: 0{this.state.time}:00</h1>}
            </center>
            <div>
              <div> 
                <a onClick={!this.state.record ? this.start : console.log("just_record")} style={{
                  position: "absolute", 
                  left: 0, 
                  right: 0, 
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "300px",
              }} className="btn-sos">
                  <img style={{
                  position: "absolute", 
                  left: 0, 
                  right: 0, 
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "300px",
              }} src={sos} alt=""/>
                </a>
                {/* <button onClick={this.stopRecording} type="button">Stop</button>
                <ReactMic
                  style={{opacity: 0}}
                  record={this.state.record}
                  className="sound-wave"
                  onStop={this.onStop}
                  onData={this.onData}
                  strokeColor="#000000" /> */}
              </div>
              <div style={{
                position: "absolute",
                bottom: "10%",
                left: 0
              }}>
                <img src={alberto} alt=""/>
              </div>
              <div style={{
                position: "absolute",
                bottom: "30%",
                right: 0
              }}>
                <img src={bird} alt=""/>
              </div>
            </div>
          </Tab>
          <Tab id="tab-2" className="page-content" tabActive>
          <Card className="demo-card-header-pic">
            <CardHeader
              className="no-border"
              valign="bottom"
              style={{ backgroundImage: 'url(https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg)', height: "100px", color: "white" }}
            >Journey To Mountains</CardHeader>
            <CardContent>
              <p className="date" style={{color: "grey"}}>Posted on January 21, 2015</p>
              <p>Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit...</p>
            </CardContent>
            <CardFooter>
              <Link style={{color: "black", fontWeight: "bold"}}>Details</Link>
            </CardFooter>
          </Card>
          <Card className="demo-card-header-pic">
            <CardHeader
              className="no-border"
              valign="bottom"
              style={{ backgroundImage: 'url(https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg)', height: "100px", color: "white" }}
            >Journey To Mountains</CardHeader>
            <CardContent>
              <p className="date" style={{color: "grey"}}>Posted on January 21, 2015</p>
              <p>Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit...</p>
            </CardContent>
            <CardFooter>
              <Link style={{color: "black", fontWeight: "bold"}}>Details</Link>
            </CardFooter>
          </Card>
          </Tab>
          <Tab id="tab-3" className="page-content">
            <Block>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa, asperiores sunt. Cum, provident officiis debitis consectetur fuga, incidunt temporibus cumque in sint voluptate facere atque, aspernatur et quas. Sit, explicabo!
            </Block>
          </Tab>
        </Tabs>
      </Page>
    //   <Page>
    //     <Navbar>
    //       <NavLeft>
    //         <Link popoverOpen=".popover-menu">
    //           <Icon ion="ios-menu" />
    //         </Link>
    //       </NavLeft>
    //       <NavTitle>{config.name}</NavTitle>
    //       <NavRight>
    //         <Link href="/about/">
    //           <Icon ion="md-more" />
    //         </Link>
    //       </NavRight>
    //     </Navbar>
    //     <BlockTitle>Welcome to My App</BlockTitle>
    //     <Block strong>
    //       <p>
    //         Mauris posuere sit amet metus id venenatis. Ut ante dolor, tempor
    //         nec commodo rutrum, varius at sem. Nullam ac nisi non neque ornare
    //         pretium. Nulla mauris mauris, consequat et elementum sit amet,
    //         egestas sed orci. In hac habitasse platea dictumst.
    //       </p>
    //     </Block>
    //     <Button popoverOpen=".popover-menu">HELLO!!!!</Button>
    //     <Popover className="popover-menu" style={{background: "bottom"}}>
    //       <center>
    //         <div style={{position: "relative"}}>
    //           <img src={ebaniyEnot} width="200px" />
    //           <p style={{
    //             position: "absolute", 
    //             zIndex: 1000000000000,
    //             color: "white",
    //             width: 100,
    //             top: 100,
    //             fontSize: "13px",
    //             left: 80

    // //             width: 100px;
    // // top: 100px;
    // // font-size: 13px;
    // // left: 80px;
    //         }}>Тыкнешь и охуеешь, че буит</p>
    //         </div>
    //       </center>
    //     </Popover>
        // <ReactMic
        //   record={this.state.record}
        //   className="sound-wave"
        //   onStop={this.onStop}
        //   onData={this.onData}
        //   strokeColor="#000000"
        //   backgroundColor="#FF4081" />
    //     <button onClick={this.startRecording} type="button">Start</button>
    //     <button onClick={this.stopRecording} type="button">Stop</button>
    //     <BlockTitle>Navigation</BlockTitle>
    //     <List>
    //       <ListItem link="/about/" title="About" />
    //       <ListItem link="/settings/" title="Settings" />
    //     </List>
    //   </Page>
    );
  }
}
