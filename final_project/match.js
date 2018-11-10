function match(){

    document.getElementById("right").innerHTML='';
    var iframe=document.createElement('iframe');
    iframe.setAttribute('src','match.html');
    iframe.setAttribute('width','78%');
    iframe.setAttribute('height','640px');
    iframe.setAttribute('float','left');
    document.getElementById("right").appendChild(iframe);
}