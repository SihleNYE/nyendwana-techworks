const m=document.querySelector(".menu"),n=document.querySelector(".links"),service=document.querySelector("#service"),customService=document.querySelector("#custom-service"),renovation=document.querySelector("#renovation-enquiry"),renovationCta=document.querySelector("#renovation-cta");
if(m&&n)m.onclick=()=>n.classList.toggle("open");
function updateEnquiry(){if(!service)return;if(customService)customService.hidden=service.value!=="Other / my own service";if(renovation)renovation.hidden=service.value!=="Website renovation and migration"}
if(service)service.onchange=updateEnquiry;
if(renovationCta)renovationCta.onclick=()=>{service.value="Website renovation and migration";updateEnquiry()};
const year=document.querySelector("#year");if(year)year.textContent=new Date().getFullYear();