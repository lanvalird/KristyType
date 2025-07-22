import random from "random";

export const randomIntFromInterval = (min: number, max: number): number => {
  return random.int(min, max);
};
