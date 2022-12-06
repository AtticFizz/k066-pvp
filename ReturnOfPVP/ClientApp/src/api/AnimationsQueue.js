const playSequentially = async (queue) => {
  while (queue.length > 0) {
    let anims = queue.shift();
    await Promise.all(anims());
  }
};

const playWithDelay = async (queue, delay) => {
  while (queue.length > 0) {
    let anims = queue.shift();
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(anims());
      }, delay);
    });
  }
};

const push = (queue, controllers, animations) => {
  let cArr = controllers;
  if (!Array.isArray(controllers)) cArr = [controllers];
  let aArr = animations;
  if (!Array.isArray(animations)) aArr = [animations];

  if (cArr.length !== aArr.length) throw new Error("Invalid function call.");

  const func = () => {
    let res = [];

    cArr.forEach((e, i) => {
      if (Array.isArray(e)) {
        res = [...res, ...e.map((a) => a.start(aArr[i]))];
      } else {
        res = [...res, e.start(aArr[i])];
      }
    });
    return res;
  };

  queue.push(func);
};

const pushFunc = (queue, func) => {
  queue.push(func);
};

const AnimationsQueue = { playSequentially, playWithDelay, push, pushFunc };

export default AnimationsQueue;
