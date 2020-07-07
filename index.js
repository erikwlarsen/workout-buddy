const fs = require('fs');
const path = require('path');
const text2Wav = require('text2wav');
const player = require('play-sound')();
const { spawn } = require('child_process');

const {
  steps,
  stepRest,
  circuitRest,
  circuits,
} = require('./workout.json');

const oldPlay = player.play;
player.play = (...args) => new Promise((resolve, reject) => {
  oldPlay.call(player, ...args, (err) => {
    if (err) reject(err);
    else resolve();
  });
});

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const waitForStdin = () => new Promise(resolve => {
  process.stdin.once('data', resolve);
});

const genericSteps = {
  stepRest: `rest ${stepRest} seconds`,
  circuitRest: `rest ${circuitRest} seconds`,
  begin: 'begin',
  done: 'all done!',
};

const allSteps = new Array(circuits)
  .fill([genericSteps.circuitRest, circuitRest])
  .reduce((acc, circuitRest) => {
    steps.forEach(step => {
      acc.push(step);
      acc.push([genericSteps.stepRest, stepRest]);
    });
    return acc.slice(0, -1).concat([circuitRest]);
  }, []);
allSteps.push([genericSteps.done, 0.1]);

if (!fs.existsSync(path.resolve(__dirname, 'sounds'))) {
  fs.mkdirSync(path.resolve(__dirname, 'sounds'));
}

(async () => {
  // Keep the screen on
  const caffeinate = spawn('caffeinate', ['-d']);
  await Promise.all(allSteps.map(async ([stepName]) => {
    const filePath = path.resolve(__dirname, 'sounds', `${stepName}.wav`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, await text2Wav(stepName));
    }
  }));

  await Promise.all(Object.values(genericSteps).map(async (step) => {
    const wavPath = path.resolve(__dirname, 'sounds', `${step}.wav`);
    if (!fs.existsSync(wavPath)) {
      fs.writeFileSync(wavPath, await text2Wav('begin'));
    }
  }));

  for (const [stepName, duration, countdown] of allSteps) {
    const stepFilePath = path.resolve(__dirname, 'sounds', `${stepName}.wav`);
    process.stdout.write(stepName);
    player.play(stepFilePath);
    if (duration) {
      if (countdown) {
        await sleep(countdown);
        const beginFilePath = path.resolve(__dirname, 'sounds', `begin.wav`);
        player.play(beginFilePath);
      }
      await sleep(duration);
      process.stdout.write('\n');
    } else {
      await waitForStdin();
    }
  }
  const doneFilePath = path.resolve(__dirname, 'sounds', 'all done!.wav');
  player.play(doneFilePath);
  caffeinate.kill(0);
  process.exit(0);
})();
