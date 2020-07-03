This silly little program guides circuit-based workouts for you. Add a `workout.json` file to the root directory that looks like this:
```json
{
  "steps": [
    ["12 bodyweight squats"],
    ["6 pushups"],
    ["30 second plank", 30, 5],
    ["20 jumping jacks"],
    ["12 reverse lunges"],
    ["10 lying hip raises"]
  ],
  "stepRest": 15,
  "circuitRest": 60,
  "circuits": 5
}
```
`steps<[][]>` should be a 3D array (an array of arrays). The outer array represents an entire circuit, and each sub-array represents a step. Steps must have a description at index 0 that the program will speak aloud. Steps can also optionally have a step duration at index 1 and a delay between speaking the step name and starting the duration countdown at index 2.

`stepRest<number>` configures how long to rest between each step.

`circuitRest<number>` configures how long to rest between each circuit.

`circuits<number>` configures how many circuits to perform.

Once your `workout.json` file is done and you are attired in your futuristic racerback workout jeggings,
```
npm install
npm start
```
The first startup will take a bit and may produce warning logs as wav files are generated for the different steps. If a wav file already exists, it will not be re-created. Once the robot workout instructor has intoned a step, you can hit Enter/Return to indicate that you are done with that step. Any step that has a duration will proceed automatically to the next step when the duration is up.
