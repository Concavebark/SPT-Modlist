import * as fs from "fs";
import got from "got";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

function Card(modName, modDesc, modLink, modImg, modSupVer, modAuth, modDateTime, dataDate, dataTime, dataOffset, title, displayedTime, modRating) {
  this.modName = modName;
  this.modDesc = modDesc;
  this.modLink = modLink;
  this.modImg = modImg;
  this.modSupVer = modSupVer;
  this.modAuth = modAuth;
  this.modDateTime = modDateTime;
  this.dataDate = dataDate;
  this.dataTime = dataTime;
  this.dataOffset = dataOffset;
  this.title = title;
  this.displayedTime = displayedTime;
  this.modRating = modRating;
}
Card.prototype.toString= function() {
  return 'modName: ' + this.modName + " modDesc: " + this.modDesc 
    + " modLink: " + this.modLink + " modImg: " + this.modImg 
    + " modSupVer: " + this.modSupVer + " modAuth: " + this.modAuth 
    + " modRating: " + this.modRating;
};

let modCards = [];
const template= 'https://hub.sp-tarkov.com/files/?pageNo=NUMBER&sortField=time&sortOrder=DESC';
const promises = [];

function getMods(pages) {
  
  for (let j = 0; j < pages; j++) {
    const promise = got(template.replace('NUMBER', j+1)).then(response => {
      const dom = new JSDOM(response.body);
      var files = dom.window.document.getElementsByClassName("filebaseFile");

      for (let i = 0; i < files.length; i++) {
        let name = files[i].getElementsByClassName("filebaseFileSubject")[0].textContent.replace(/\t/g, '').replace(/\n/g, '');
        let desc = files[i].getElementsByClassName("filebaseFileTeaser")[0].textContent.replace(/\t/g, '').replace(/\n/g, '');
        let link = files[i].querySelector('a').href;
        // This ternary operator just checks to see if this modCard contains an icon file, and if it doesn't, sets the modImg to "None" so there aren't any runtime errors
        let img = (files[i].querySelector('img') != null ? files[i].querySelector('img').src : "None"); 
        let supportedVer = "";
        if (files[i].getElementsByClassName('labelList')[0] != undefined) {
          supportedVer = files[i].getElementsByClassName('labelList')[0].textContent.replace(/\t/g, '').replace(/\n/g, '');
        }       
        let author = files[i].getElementsByClassName("filebaseFileMetaData")[0].children[0].textContent.replace(/\t/g, '').replace(/\n/g, ' ');
        let timeTag = files[i].getElementsByClassName('filebaseFileMetaData')[0].children[1].firstChild;
        let dateTime = timeTag.getAttribute('datetime');
        let dataDate = timeTag.getAttribute('data-date');
        let dataTime = timeTag.getAttribute('data-time');
        let dataOffset = timeTag.getAttribute('data-offset');
        let title = timeTag.getAttribute('title');
        let displayedTime = timeTag.textContent;
        let ratingObj = files[i].getElementsByClassName('filebaseFileRating')[0]
        let ratingWhole = 0;
        let ratingHalf = 0;
        if (ratingObj != undefined) {
          ratingWhole = ratingObj.getElementsByClassName("fa-star").length;
          ratingHalf = ratingObj.getElementsByClassName("fa-star-half-o").length;
        }
        // This ternary operator takes the value of ratingHalf and checks if its 1, if it is, add .5 to ratingWhole to signify a half star rating
        let rating = ratingWhole + (ratingHalf == 1 ? 0.5 : 0 )
        modCards.push(new Card(name, desc, link, img, supportedVer, author, dateTime, dataDate, dataTime, dataOffset, title, displayedTime, rating))
      }
    }).catch(err => {
      console.log(err);
    });

    promises.push(promise);
  }

  Promise.all(promises).then(() => {
    fs.writeFile("data.json", JSON.stringify(modCards), (error) => {
      if (error) { console.log(error); throw error; }
      console.log("data.json written successfully");
    })
  })
}

function getPages() {
  let pages;
  got(template.replace("NUMBER", 1)).then(response => {
    const dom = new JSDOM(response.body);
    pages = dom.window.document.getElementsByClassName("pagination")[0].getAttribute("data-pages");
  }).then(() => {
    getMods(pages);
  })
}

getPages();