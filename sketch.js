//Creative Coding Final Assignment: Interactive Photo Collage

/*Inspiration and sources
British & Exotic Minerology by Nicholas Rougeux: https://www.c82.net/mineralogy/
I was intrigued by the arrangement of the different minerals that seemed rather neat as a whole but upon zooming in, I noticed that the illustrations were of 
irregular shape and did not specifically follow a grid format. The color palette was also harmonious, in addition to the intuitive mouse interactions. This 
collage is of quite a large scale, consisting of 718 illustrations by James Sowerby, an early 19th-century British naturalist and mineralogist.

Facts about Flamingos: https://360.articulate.com/review/content/f78ca5b7-cee0-48ec-b616-644b8412a49c/review
In this work, I really liked how the pictures were arranged as they did not follow a strict grid rule. Additionally, there was a clear indication of the images that
have been clicked on, which is what I would be incorporating in my sketch.

Content: https://www.boredpanda.com/cat-maneuvers-explained-itsjayordan/?utm_source=google&utm_medium=organic&utm_campaign=organic
I chanced upon an article about a vet who had pinned up witty explanations of cat bahaviours on his cork board. As the illustrations in the article are all in grayscale, 
I will be sourcing for similar/new images/videos that are reflective of the cat behaviours.
These explanations were originally created by Adam Ellis from BuzzFeed and can be found here: https://www.buzzfeed.com/adamellis/shocking-truths-behind-what-cat-behaviors-actually-mean?utm_term=.oc4OXODaA#.hnZWAWb4E

About my sketch
While sourcing for videos, I wanted to create a contrast between the image/video shown for the 2 different explanations, thus, I sourced for videos and gifs of cats in anime
(for the "Expert" explanation), as well as meme-ish cats (for "Truth" explanation).
I decided on anime cats as I really like the style of illustration used as well as the color palettes of each frame.

*/

var expandedView = false;

class Frame {
    constructor(video, divElt, behaviour, expExpert, expTruth, anime, pauseTime, memeGif, frameHgt){
        this.x = 0;
        this.y = 0;
        this.height = frameHgt;
        this.width = 0;

        this.video = video;
        this.behaviour = behaviour;
        this.explanations = [expExpert, expTruth];
        this.anime = anime;
        this.pauseTime = pauseTime;
        this.memeGif = memeGif;
        
        this.title = divElt;

        this.isPaused = true;
        this.clicked = false;   //has video been clicked on before
        this.border = 0;
        this.whiteOut = false;

        this.expand = false;   //determines to which behaviour to show in expanded view
        this.expIndex = 0;
    }

    display(x, y){
        this.x = x;
        this.y = y;

        if(this.width == 0){
            this.calcFrameWidth();
        }

        if(expandedView == false){
            this.expand = false;

            if(mouseX > this.x && mouseX < this.x + this.width &&
                mouseY > this.y && mouseY < this.y + this.height){
                //when hover on frame
                    if(this.isPaused){
                        this.video.loop();
                        print("HOVER: "+ this.behaviour);

                        this.isPaused = false;
                        this.title.position(this.x, this.y+(this.height*0.9));
                        this.title.size(this.width, this.height*0.25);
                        this.title.show();

                        this.border = 20;
                        this.whiteOut = false;
                    } 
                }
            else{
                this.video.pause().time(this.pauseTime);
                this.isPaused = true;
                this.title.hide();

                this.border = 0;

                if(this.clicked){
                    this.whiteOut = true;
                }
            }
        } 
        
        rectMode(CORNER);
        // 2 rectangles are used as strokeWeight on the 2nd rectagle would result in eating into the video frame

        //rectangle to indicate hover
        stroke(255, 179, 138);
        strokeWeight(this.border);
        strokeJoin(ROUND);
        rect(this.x, this.y, this.width, this.height, 5);

        //show video in canvas
        image(this.video, this.x, this.y, this.width, this.height);

        let radius = 5;

        //rectangle to indicate clicked
        if(this.whiteOut){
            fill(255,255,255, 150);
            radius = 0;     //full whiteout when frame has been clicked on before
        }else{
            noFill();
            radius = 10;    //inner radius when hovered
        }

        strokeWeight(this.border/3);    //stroke to create inner border radius
        rect(this.x, this.y, this.width, this.height, radius);
    }

    showInfo(){  //only called when clicked and expandedView is false
        //check if click on frame
        if( mouseX > this.x && mouseX < this.x + this.width &&
            mouseY > this.y && mouseY < this.y + this.height){
                this.title.hide();
                expandedView = true;
                this.clicked = true;
                this.expand = true;
        }
    }

    infoView(){ //in expanded view
        if(this.expand){    //if current object is in expand view
            this.isPaused = false;
            let displayedMedia = this.video;
            if(this.expIndex == 0){
                displayedMedia = this.video;
            }else if(this.expIndex == 1){
                displayedMedia = this.memeGif;
            }
            let dispHgt = 250;
            let dispWdh = displayedMedia.width *dispHgt/displayedMedia.height;
            let posX = width/2 - dispWdh/2;
            image(displayedMedia, posX, 100, dispWdh, dispHgt);

            rectMode(CENTER);
            textAlign(CENTER);
            
            //behaviour placeholder
            textSize(12);
            textFont('Helvetica');
            fill(150);
            let behaviourHeaderPosY = 100 + dispHgt + 30;
            text("THE BEHAVIOUR", width/2, behaviourHeaderPosY)
            
            //show behaviour as title
            let titlePosY = behaviourHeaderPosY + 35;
            let titleSize = 22;
            textSize(titleSize);
            textFont('Georgia');
            textStyle(BOLD);
            fill(0);
            text(this.behaviour, width/2,titlePosY, 400,50);

            //subheaders
            let subheadHgt = titleSize*0.8;
            textSize(subheadHgt);
            let subheadPosY = titlePosY + 60;

            //show expert subheader
            let expertPosX = width/2 - 100;
            let subheadExpert = "\"Experts\" say";
            this.createSubheader(expertPosX, subheadExpert, subheadPosY, subheadHgt, 0);

            //show truth subheader
            let truthPosX = width/2 + 100;
            let subheadTruth = "The truth";
            this.createSubheader(truthPosX, subheadTruth, subheadPosY, subheadHgt, 1);

            let explainPosY = subheadPosY + 100;
            //create backing rectangle for explanation
            fill(0, 30);
            rect(width/2,explainPosY, 420,140, 20);
            //show explanation
            let comment = this.explanations[this.expIndex];
            fill(0);
            textStyle(NORMAL);
            textAlign(LEFT, CENTER);
            text(comment, width/2,explainPosY, 400,140);
        }
    }

    createSubheader(posX, subheaderText, posY, charHgt, index){
        //set fill for subheader when not hovered
        let textCol = color(120);
        let lineCol = color(0);
        let lineWgt = 3;

        let subheadWdh = textWidth(subheaderText);
        let startX = posX - subheadWdh/2;   //this is done as text is aligned center,center within the text box ie posX is the center of the full line of text
        
        //thicker underline on text when hover
        if(mouseX > startX && mouseX < startX + subheadWdh &&
            mouseY > posY-charHgt/2 && mouseY < posY + charHgt/2){
                //set displayed explanation
                this.expIndex = index;
                //set lineWeight
                lineWgt = 5;
            }

        //darken and show underline when subheader selected
        if(this.expIndex == index){
            textCol = color(0);    //set fill for subheader

            push(); //push pop is used so that the stroke and strokeWeight do not affect other elements in the sketch
            stroke(lineCol);
            strokeWeight(lineWgt);
            line(startX,posY+charHgt, startX + subheadWdh, posY+charHgt);
            pop();
        }

        //show subheader
        textStyle(BOLD);
        fill(textCol);
        text(subheaderText, posX, posY);
    }

    calcFrameWidth(){
        this.width = this.video.width*this.height/this.video.height;

        return this.width;
    }

}

///////////END OF CLASS DECLARATION///////////


let vid_filelist = ['files/anime_0001_legup.mp4',
                    'files/anime_0002_hidden.mp4',
                    'files/anime_0003_chatter.mp4',
                    'files/anime_0004_roll.mp4',
                    'files/anime_0005_sleepcircle.mp4',
                    'files/anime_0006_laptop.mp4',
                    'files/anime_0007_squint.mp4',
                    'files/anime_0008_bite.mp4',
                    'files/anime_0009_quiverpounce.mp4',
                    'files/anime_0010_bellyflop.mp4',
                    'files/anime_0011_stare.mp4',
                    'files/anime_0012_knead.mp4',
                    'files/anime_0013_butt.mp4',
                    'files/anime_0014_catloaf.mp4',
                    'files/anime_0015_sleepbox.mp4',
                   ]
let vid_list = [];
let meme_list = [];
var catsData = [];
var frames = [];    //contains all Frame class objects


function preload(){
    //load videos
    for(let filename of vid_filelist){
        let video = createVideo([filename]);
        //video settings
        video.volume(0);
        video.hide();

        vid_list.push(video);
    }

    print(vid_list.length + " videos are loaded into the vidlist!");

    //load cat behaviour json
    loadJSON('files/data_catBehaviours.json', function(data){
        catsData = data;
        print("catsData loaded");

        //load meme gifs
        for(let data of catsData){
            meme_list.push(loadImage(data.MemeGif));    //as a hyperlink is used, results in a long loading time
        }
        print(meme_list.length + " gifs are loaded into meme_list")
      })
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    let headerHgt = height/5;
    let frameHgt = (height - headerHgt) / 4.3;

    for(let i=0; i < vid_list.length; i++){
        let video = vid_list[i];
        
        //extract data from cats behaviour json
        let data = catsData[i];
        let behaviour = data.Behaviour;
        let expExpert = data.Experts;
        let expTruth = data.Truth;
        let anime = data.Anime;
        let pauseTime = data.PauseTime;

        let memeGif = meme_list[i];
        
        let header = createDiv(behaviour);
        header.style('font-family', 'Georgia');
        let fontSize = frameHgt*0.12;
        header.style('font-size', fontSize + 'px');
        header.style('background-color', 'rgba(255,255,255, 0.7)');
        header.style('padding', fontSize*0.3 + 'px');

        frames.push(new Frame(video, header, behaviour, expExpert, expTruth, anime, pauseTime, memeGif, frameHgt));
    }
}

function draw() {
    // background(211,225,234);
    background(184, 205, 216)

    //title of sketch
    noStroke();
    textFont('Georgia');
    textAlign(CENTER)
    textSize(30);
    fill(17,30,98);  //dark blue for sketch title
    text("15 Cat Behaviours and What They Really Mean", width/2, 110);
    textSize(25);
    text("Anime Version", width/2, 150);
    
    //display frames
    let startX = 100;
    let x = startX;
    let y = height/4 + 15;
    let spacing = 0;
    let framesPerRow = 5;

    for(let i=0; i < frames.length; i++){
        let frame = frames[i];
        frame.display(x, y);    //display frames

        //determine spacing value  -- when frame is first frame of each row
        if(i%framesPerRow == 0){
            //subtract "paddings" and current frame width
            spacing = windowWidth - startX*2 - frame.width;
            //substract width of other frames in the same row
            for(let j=1; j < framesPerRow; j++){
               spacing = spacing - frames[i+j].calcFrameWidth();
            }
            //find value of each spacing by dividing by number of spaces
            spacing = spacing/(framesPerRow - 1);
        }

        //new x and y values for next frame
        x = x + frame.width + spacing;
        if((i+1)%framesPerRow == 0 && i!=0){
            x = startX;
            y = y + frame.height*1.25;
        }
    }

    if(expandedView){
        //create whited out backing, this will be overlay on all frames
        fill(255, 100);
        rect(0,0, windowWidth, windowHeight);

        //create dialog box to show information
        push();
        rectMode(CENTER);
        noStroke();
        fill(0,0,0, 20);
        rect(windowWidth/2, windowHeight/2,  (windowWidth/3)*1.03, windowHeight*0.82);  //shadow
        fill(228,234,239);
        rect(windowWidth/2, windowHeight/2,  windowWidth/3, windowHeight*0.8);
        pop();

        for(let i=0; i < frames.length; i++){
            let frame = frames[i];
            frame.infoView();
        }
    }
}

function mouseClicked() {
    if(expandedView){
        if(mouseX < windowWidth/2-windowWidth/6 || mouseX > windowWidth/2+windowWidth/6 ||
            mouseY < windowHeight/2-windowHeight*0.4 || mouseY > windowHeight/2+windowHeight*0.4){
                //when click outside of box, close dialog box
                expandedView = false;
            }
    }
    else{
        for(let i=0; i < frames.length; i++){
            let frame = frames[i];
            frame.showInfo();
        }
    }
}