(function(){ 

  // Pas de var sinon c po partagé
  get_destination = function(x, y, xBallSpeed, yBallSpeed, width, height) {
    // Interpolation lineaire de l'impact de la balle     
    //console.log("width : " + width + ",height : " + height); 
    //console.log("xBallSpeed : " + xBallSpeed + ",yBallSpeed : " + yBallSpeed);
    //console.log("ball.x : " + x + ",ball.y : " + y); 
    var widthBetween = width - 80;
    var heightBetween = height - 30;
    //console.log('widthBetween : ' + widthBetween + ', heightBetween : ' + heightBetween);
    var destination = Math.abs((widthBetween - x) * (yBallSpeed / xBallSpeed) + y);
    // Centrage barre
    destination -= height / 10;
    // Centrage balle
    destination += 15; 
    // Gestion rebond(s) 
    //console.log("destination avant rebond : " + destination);
    var nombreRebonds = Math.floor(Math.abs(destination / heightBetween));   
    //console.log("nombre de rebonds prévus : " + nombreRebonds);
    if(nombreRebonds != 0) {               
      if(nombreRebonds % 2 == 0 ^ yBallSpeed < 0) {             
        //console.log("Nombre pair de rebonds"); 
        destination = destination % heightBetween;                    
      } else {
        //console.log("Nombre impair de rebonds");
        destination = heightBetween - (destination % heightBetween);
      } 
    } else {
      // Si pas de rebond on assaisonne (salt)
      //destination += (Math.random() * (height /5)) - (height / 10);
    }
    //console.log("destination : " + destination);
    return destination;
  };
  
  get_move_step = function(destination, y, height) {
  
    var moveStep = 0;
    //console.log("destination : " + destination + ", y : " + y + ", height : " + height);
    if(destination > y) {
      moveStep = 4 % (destination - y);
    }
    else if(destination < y) {
      moveStep = 4 % (y - destination);
      if (y - moveStep > 0) {
        moveStep = -moveStep;
      }
    } 
    //console.log("moveStep : " + moveStep);
    return moveStep;
        
  };
  
  move_to = function(x, y, xBallSpeed, yBallSpeed, width, height) {
  
    var destination = get_destination(x, y, xBallSpeed, yBallSpeed, width, height);
  
    return get_move_step(destination, y, height);
    
  }; 

}).call(this);

