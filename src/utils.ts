function shuffle(array: string[]) {
  return array.sort(() => 0.5 - Math.random());
}

export default shuffle;
