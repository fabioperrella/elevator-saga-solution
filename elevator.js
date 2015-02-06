//http://play.elevatorsaga.com/#challenge=4
{
  init: function(elevators, floors) {
    var self = this;

    for(j=0; j < elevators.length ; j++){
      elevators[j].number = j;

      elevators[j].on("idle", function() {

      });

      elevators[j].on("floor_button_pressed", function(floorNum) {
        this.goToFloor(floorNum);
      })
    }

    floors[0].on("up_button_pressed", function(){
      self.nearest_elevator(elevators, this).goToFloor(0);
    })
    for(i=1; i<=6; i++){
      floors[i].on("up_button_pressed", function(){
        self.nearest_elevator(elevators, this).goToFloor(i);
      })
      floors[i].on("down_button_pressed", function(){
        self.nearest_elevator(elevators, this).goToFloor(i);
      })
    }
    floors[7].on("down_button_pressed", function(){
      self.nearest_elevator(elevators, this).goToFloor(7);
    })
  },
  update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
  },

  nearest_elevator: function(elevators, current_floor){
    var nearest_elevator = null
    var nearest_elevator_distance = 999

    for(var x=0; x < elevators.length; x++){
      var distance = Math.abs(elevators[x].currentFloor() - current_floor.floorNum());
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