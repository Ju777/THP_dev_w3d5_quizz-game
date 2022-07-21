var animation = anime({
    targets: '#blue-block',
    translateX: 1000,  
    duration : 5000,
    autoplay : false,
    direction : "alternate",
    borderRadius : ['0%', '100%'],
    scale : 0.5
    // loop : true
  });


  document.querySelector('#blue-block').onclick = animation.play;
 
