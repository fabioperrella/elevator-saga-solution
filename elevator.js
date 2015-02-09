{
  init: function(elevators, floors) {
    var self = this;
    window.up_buttons_pressed = [];
    window.down_buttons_pressed = [];
    window.elevators = elevators;

    for(j=0; j < elevators.length ; j++){
      elevators[j].number = j;

      elevators[j].on("idle", function() {

      });

      elevators[j].on("floor_button_pressed", function(floorNum) {
        this.goToFloor(floorNum);
      });

      elevators[j].on("passing_floor", function(floorNum, direction) {
      });

      elevators[j].on("stopped_at_floor", function(floorNum) {
        var index = window.down_buttons_pressed.indexOf(floor_num)
        if(index >= 0){
          window.down_buttons_pressed.splice(index, 1);
          console.log("removed floor " + floorNum + " from down_buttons_pressed")
        }

        index = window.up_buttons_pressed.indexOf(floor_num)
        if(index >= 0){
          window.up_buttons_pressed.splice(index, 1);
          console.log("removed floor " + floorNum + " from up_buttons_pressed")
        }
      })
    }

    floors[0].on("up_button_pressed", function(){
      self.up_button_pressed(this.floorNum());
    });

    for(i=1; i<=6; i++){
      floors[i].on("up_button_pressed", function(){
        self.up_button_pressed(this.floorNum());
      });

      floors[i].on("down_button_pressed", function(){
        self.down_button_pressed(this.floorNum());
      });
    }

    floors[7].on("down_button_pressed", function(){
      self.down_button_pressed(this.floorNum());
    });
  },

  down_button_pressed: function(floor_num) {
    if(window.down_buttons_pressed.indexOf(floor_num) == -1){
      window.down_buttons_pressed.push(floor_num);
    }
    this.nearest_elevator(window.elevators, floor_num).goToFloor(floor_num);
  },

  up_button_pressed: function(floor_num) {
    if(window.up_buttons_pressed.indexOf(floor_num) == -1){
      window.up_buttons_pressed.push(floor_num);
    }
    this.nearest_elevator(window.elevators, floor_num).goToFloor(floor_num);
  },

  update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
  },

  nearest_elevator: function(elevators, current_floor_num){
    var nearest_elevator = null
    var nearest_elevator_distance = 999

    for(var x=0; x < elevators.length; x++){
      var distance = Math.abs(elevators[x].currentFloor() - current_floor_num);
      if(distance < nearest_elevator_distance){
        nearest_elevator = elevators[x];
        nearest_elevator_distance = distance
      }
    }

    console.log("nearest elevator: " + nearest_elevator.number + " distance: " + nearest_elevator_distance);
    return nearest_elevator;
  },

  empty_elevator: function(elevators){
    var empty_elevator = null
    var empty_elevator_load = 1

    for(var x=0; x < elevators.length; x++){
      var load = elevators[x].loadFactor()
      if(load < empty_elevator_load){
        empty_elevator = elevators[x];
        empty_elevator_load = load
      }
    }

    console.log("empty elevator: " + empty_elevator.number + " load: " + empty_elevator_load);
    return empty_elevator;
  }
}