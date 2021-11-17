const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('contents .container ul li');
// console.log(navLi)

window.addEventListener('scroll', ()=>{
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        // console.log(sectionTop);

        const sectionHeight = section.clientHeight; //get height of section
        if(scrollY >= (sectionTop - sectionHeight/20)){
            current = section.getAttribute('id');
        }
    })
    // console.log(current);
    
    navLi.forEach( li => {
        li.classList.remove('active');
        if(li.classList.contains(current)){
            li.classList.add('active');
            // console.log(current + " active");
        }
    })
})