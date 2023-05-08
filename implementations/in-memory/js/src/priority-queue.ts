export class PriorityQueue<T> {
  private items: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return index * 2 + 1;
  }

  private getRightChildIndex(index: number): number {
    return index * 2 + 2;
  }

  private swap(index1: number, index2: number): void {
    const temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  private heapifyUp(index: number): void {
    while (index > 0 && this.compare(this.items[index], this.items[this.getParentIndex(index)]) < 0) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown(index: number): void {
    let minIndex = index;

    const leftChildIndex = this.getLeftChildIndex(index);
    if (leftChildIndex < this.items.length && this.compare(this.items[leftChildIndex], this.items[minIndex]) < 0) {
      minIndex = leftChildIndex;
    }

    const rightChildIndex = this.getRightChildIndex(index);
    if (rightChildIndex < this.items.length && this.compare(this.items[rightChildIndex], this.items[minIndex]) < 0) {
      minIndex = rightChildIndex;
    }

    if (index !== minIndex) {
      this.swap(index, minIndex);
      this.heapifyDown(minIndex);
    }
  }

  public push(item: T): void {
    this.items.push(item);
    this.heapifyUp(this.items.length - 1);
  }

  public pop(): T | undefined {
    if (this.isEmpty()) return undefined;
    const top = this.items[0];
    this.items[0] = this.items[this.items.length - 1];
    this.items.pop();
    this.heapifyDown(0);
    return top;
  }

  public peek(): T | undefined {
    return this.isEmpty() ? undefined : this.items[0];
  }

  public remove(item: T): void {
    const index = this.items.indexOf(item);
    if (index === -1) return;

    this.items[index] = this.items[this.items.length - 1];
    this.items.pop();
    this.heapifyDown(index);
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }
}
