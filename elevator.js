{
  init: function(elevators, floors) {
    var self = this;
    window.up_buttons_pressed = [];
    window.down_buttons_pressed = [];
    window.elevators = elevators;

    for(j=0; j < elevators.length ; j++){
      console.log("j: " + j)
      elevators[j].number = j;

      elevators[j].on("idle", function() {
        console.log("elevator (" + this.number + ") idle, current floor: " + this.currentFloor())
        self.goToNextFloor(this)
      });

      elevators[j].on("floor_button_pressed", function(floorNum) {
        console.log("elevator (" + this.number + ") floor_button_pressed: " + floorNum)
      });

      elevators[j].on("passing_floor", function(floorNum, direction) {
      });

      elevators[j].on("stopped_at_floor", function(floorNum) {
        self.remove_flor_from_queue(floorNum, window.down_buttons_pressed)
        self.remove_flor_from_queue(floorNum, window.up_buttons_pressed)

        this.destinationQueue = []
      })
    }

    floors[0].on("up_button_pressed", function(){
      self.up_button_pressed(this.floorNum());
    });

    for(i=1; i < floors.length-1; i++){
      floors[i].on("up_button_pressed", function(){
        self.up_button_pressed(this.floorNum());
      });

      floors[i].on("down_button_pressed", function(){
        self.down_button_pressed(this.floorNum());
      });
    }

    floors[floors.length-1].on("down_button_pressed", function(){
      self.down_button_pressed(this.floorNum());
    });
  },

  goToNextFloor: function(elevator){
    console.log("elevator (" + elevator.number + ") goToNextFloor: pressed floors: " + elevator.getPressedFloors())
    var next_floor

    var all_floor_pressed = elevator.getPressedFloors().concat(window.down_buttons_pressed).concat(window.up_buttons_pressed)
    var nearest_flor = this.get_nearest_floor(all_floor_pressed, elevator)

    this.remove_flor_from_queue(nearest_flor, window.down_buttons_pressed)
    this.remove_flor_from_queue(nearest_flor, window.up_buttons_pressed)

    if(nearest_flor != undefined){
      console.log("elevator (" + elevator.number + ") goToNextFloor going to floor " + nearest_flor)
      elevator.goToFloor(nearest_flor)
    }
  },

  remove_flor_from_queue: function(floor_num, queue){
    var index
    index = queue.indexOf(floor_num)
    if(index != -1){
      queue.splice(index, 1)
    }
  },

  down_button_pressed: function(floor_num) {
    if(window.down_buttons_pressed.indexOf(floor_num) == -1){
      window.down_buttons_pressed.push(floor_num);
    }
  },

  up_button_pressed: function(floor_num) {
    if(window.up_buttons_pressed.indexOf(floor_num) == -1){
      window.up_buttons_pressed.push(floor_num);
    }
  },

  update: function(dt, elevators, floors) {
      // We normally don't need to do anything here
  },

  get_nearest_floor: function(queued_flors, elevator){
    var current_floor_num = elevator.currentFloor()
    var nearest_floor = null
    var nearest_flor_distance = 999

    for(var x=0; x < queued_flors.length; x++){
      var distance = Math.abs(current_floor_num - queued_flors[x]);
      if(distance == 0){
        continue
      }
      if(distance < nearest_flor_distance){
        nearest_floor = queued_flors[x];
        nearest_flor_distance = distance
      }
    }

    console.log("elevator(" + elevator.number + ") nearest flor: " + nearest_floor + ", distance: " + nearest_flor_distance + ", currentFloor: " + current_floor_num + ", queued_flors: " + queued_flors);
    return nearest_floor;
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