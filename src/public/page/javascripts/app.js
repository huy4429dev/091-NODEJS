// Get date
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = m + "/" + d + "/" + y;

//Nav header login and register
const navSlide = () =>{
    const burger = document.querySelector('.burger')
    const nav = document.querySelector('.nav-links')
    const navLinks = document.querySelectorAll('.nav-links li')
    
    burger.addEventListener('click', ()=>{
        //toggle nav
        nav.classList.toggle('nav-active')

        //animate links -> fade
        navLinks.forEach((link, index) =>{
            if (link.style.animation){
                link.style.animation = ''
            }
            else{
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`
                // console.log(index/7);
            }
        })
        
        //burger animation
        burger.classList.toggle('toggle')
    })
}
navSlide();



// const app = ()=>{
//     navSlide();
// }
