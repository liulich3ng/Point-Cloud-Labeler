class Counter {
  private counter = 0;

  public incrementAndGetCounter() {
    return ++this.counter;
  }

  public setCounter(counter: number) {
    this.counter = counter;
  }
}

export const annotationCounter = new Counter();
