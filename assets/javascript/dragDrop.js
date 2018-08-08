
function allowDrop(ev) {
    ev.preventDefault();

}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// drop into Accordion
function dropR(ev, el){
    
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    
    if(ev.target.getAttribute('data-append') == document.getElementById(data).getAttribute('data-append')){
        var child = document.getElementById(data);
        child.childNodes[2].style.borderRadius = "";
        child.childNodes[2].style.width = "auto";
        child.childNodes[2].style.height = "100px";
        child.childNodes[2].style.position = "relative";
        child.childNodes[2].style.bottom = "";
        child.childNodes[2].style.right = "";

        child.style.width = "fit-content";
        child.style.minHeight = '';
        child.style.maxHeight = '';
        if (ev.target.getAttribute('data-append') == "blue"){

            child.style.height = "390px";
        }
        else{
            child.style.height = "330px";
        }
        
        console.log(child);
        el.appendChild(child);
    }
  }

// drop into favorites section
function dropF(ev, el) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if(ev.target.getAttribute('data-append') == document.getElementById(data).getAttribute('data-append')){
        var child = document.getElementById(data);
        child.childNodes[2].style.borderRadius = "50%";
        child.childNodes[2].style.width = "16%";
        child.childNodes[2].style.height = "auto";
        child.childNodes[2].style.position = "absolute";
        child.childNodes[2].style.bottom = "10px";
        child.childNodes[2].style.right = "5px";

        child.style.width = "100%";

        if(document.getElementById(data).getAttribute('data-append') == 'green'){
            child.style.minHeight = '160px';
            child.style.maxHeight = '160px';
        }else{
            child.style.height = "fit-content";
            }
        el.appendChild(child);
    }

  }