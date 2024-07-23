let currentsong= new Audio() //global variables
let songs; //global variables
let currfolder;  //global variables
function secondtominutes(seconds){

    if( isNaN(seconds) || seconds<0){                               
        return "Wait Bro"
    }

    const min =Math.floor(seconds/60);
    const remainsec =Math.floor(seconds%60);

    const formattmin=String(min).padStart(2,"0");                        //convert time sec. to  min.
    const formattsec=String(remainsec).padStart(2,"0");
    return `${formattmin}:${formattsec}`;

}
async function getsongs(folder) {
    currfolder = folder               //play a songs in a folders 
    songs =await fetch(`/${folder}/`)       //fetch all songs from folder       

    let response =await songs.text();

//    console.log(response.toString())       //convert all songs in html text string
    let div = document.createElement("div")    //create a element div 
    div.innerHTML = response                 //transport all songs in div 
    let a = div.getElementsByTagName("a")      //find the element by song name
    // console.log(a)
     songs = [];                            // create new array  and transport all songs in this array 
    for (let index = 0; index < a.length; index++) {     //for loop for get element (href) of songs
        const element = a[index];
        if (element.href.endsWith(".mp3")) {       //endwith and startwith use for element first and last word 

            songs.push(element.href.split(`/${currfolder}/`)[1] )     //songs in array form
        }

    }

   //all songs are append in ul>li 
   let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
   songul.innerHTML=""                   //ul blank so click on the card and get all songs of the folders and songs not appends 
   for ( s of songs) {
       songul.innerHTML =songul.innerHTML + `                                
        <li >                                                                                
        <img class="img" src="img/music (3).png" alt="hd" >           
        <div class="info">
            <div class=".songname">${s.replaceAll("%20"," ")} </div>
            <div class".songartist" >Sanjay Malviya</div>
        </div>
        <div class="playnow">
        <span>Play now</span>
        <img id="simg" src="img/play.png" alt="wait pls" >
    </div>
   </li>`              
   }
   
   
   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
       e.addEventListener("click",()=>{
        //    console.log(e.querySelector(".info").firstElementChild.innerHTML)                     //get all songs from li
           Playmusic(e.querySelector(".info").firstElementChild.innerHTML)                   //pass the songs through the fun.
       })
   })
 return songs                        //return all songs 
}

const Playmusic=(track,pause=false)=>{
    currentsong.src = `/${currfolder}/` + track
   if(!pause){
       currentsong.play()
       play.src= `img/pause.png`
   }
   document.querySelector(".songinfo").innerHTML= decodeURI(track)      // transfer  track(songs) in songinfo
//    console.log(document.querySelector(".songinfo").innerHTML=track)        // transfer  track(songs) in songinfo
   }

   displayalbums=async ()=>{
  let b=  await fetch(`/songs/`)              
    let response = await b.text();
    // console.log(response)
 let cardcontainer =   document.querySelector(".card-con")

    let div = document.createElement("div")    
    div.innerHTML = response 
    let atag =div.getElementsByTagName("a")

 Array.from(atag).forEach( async e =>{
                               // all songs folders href
        if(e.href.includes("/songs"))    {
            let folder =(e.href.split("songs/").slice(0)[1])      //songs folders 
            // let folder =(e.href.split("songs/").slice(-1)[0])      //songs folders 
            // console.log(folder)
            // get all the data of folder
         let a=  await fetch(`/songs/${folder}/info.json`)     //fetch json files          
            let response = await a.json();
            // console.log(response)
       //display albums (cards)
            cardcontainer.innerHTML =cardcontainer.innerHTML + `<div data-folder="${folder}" class="card "   data-aos="zoom-in-down" >
            <div class="play" >
                <img src="img/play.png" alt="play hogo" >        
 
            </div>
            <img  src="/songs/${folder}/cover.jpg" alt="error try " >
            <h2>${response.title}</h2>                         
            <p >${response.description}<p>
        </div>  `                            //json  file values
        }
        Array.from((document.getElementsByClassName("card"))).forEach((e=>{

            e.addEventListener("click",async (item)=>{
                // console.log(item,item.currentTarget.dataset)           //item =card , item.currenttrget(all element) dataset(data-folder)
            await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            Playmusic(songs[0])
            })
        }))  
    })
 
   }


async function main(){
 songs= await getsongs(`songs/r`)
// console.log(s)
    Playmusic(songs[5],true)
      displayalbums()

//   //all songs are append in ul>li 
//   let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
//   songul.innerHTML=""                   //ul blank so click on the card and get all songs of the folders and songs not appends 
//   for ( s of songs) {
//       songul.innerHTML =songul.innerHTML + `                                
//        <li>                                                                                
//        <img class="img" src="img/music (3).png" alt="hd">           
//        <div class="info">
//            <div class=".songname">${s.replaceAll("%20"," ")} </div>
//            <div class".songartist" >Sanjay Malviya</div>
//        </div>
//        <div class="playnow">
//        <span>Play now</span>
//        <img id="simg" src="img/play.png" alt="wait pls">
//    </div>
//   </li>`              
//   }

//event listen for button play 

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            
            currentsong.play()
            play.src=`img/pause.png`
    
        }
        else{
            currentsong.pause()
            play.src=`img/plays.png`

        }
    })



    //song time duration change

    currentsong.addEventListener("timeupdate",()=>{

        // console.log(currentsong.currentTime,currentsong.duration)      time of current song and duration 
        document.querySelector(".songtime").innerHTML=`${secondtominutes(currentsong.currentTime)}:${secondtominutes(currentsong.duration)}`  //set the time of songs

        document.querySelector(".circle").style.left=currentsong.currentTime / currentsong.duration * 100 + "%"        //seekbar (circle) move with current songstime
    })

    //Add event listen for seekbar 
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) *100
    document.querySelector(".circle").style.left= percent  + "%"
    currentsong.currentTime =(currentsong.duration * percent) / 100
    
    })

    //add listener for hamburger 
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-300%"
    })
    

    //add   event listener for previous button  

    previous.addEventListener("click",()=>{
        // currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])  //jump to previous song by index

        if((index - 1 >= 0)){
          Playmusic(songs[index - 1])
            }
    })


    // add event lisetner for next 
    next.addEventListener("click",()=>{
currentsong.pause()
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])                      //jump to next song by index
        // console.log(index)
        if((index+1 < songs.length)){
        Playmusic(songs[index+1])
        }
    })

    //add eventlistener for volumerange

    document.querySelector(".volumerange").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("Setting the volume",e.target.value ,"/100")

      console.log( currentsong.volume =parseInt(e.target.value)/100)
    })

        // add event listen for mute volumefunction bun(){
  
 document.querySelector(".volume").addEventListener("click",(e)=>{
                                         // console.log(e.target)
    if(e.target.src.includes("volume.svg")){

        e.target.src= e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume =0;
        document.querySelector(".volumerange").getElementsByTagName("input")[0].value =0;
    }
    else {
      
        e.target.src= e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume =0.30;
        document.querySelector(".volumerange").getElementsByTagName("input")[0].value=30;
    }


 })
 
    //load the playlisht when we click on folder(card)

// Array.from((document.getElementsByClassName("card"))).forEach((e=>{

//     e.addEventListener("click",async (item)=>{
//         // console.log(item,item.currentTarget.dataset)           //item =card , item.currenttrget(all element) dataset(data-folder)
//     await getsongs(`songs/${item.currentTarget.dataset.folder}`)
//     })
// }))
}


main()

setTimeout(() => {
    alert("Hello everyone 👋🏻 i am sanjay hope you will like it ")
}, 1000);

function notwork (){
   alert("signup kareke kya karega bro😁")
}
function notworks (){
   alert("sorry you can,t login on listen 🤔")
}



    