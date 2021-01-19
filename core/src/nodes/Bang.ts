type BangCallback = (time: number, attack: boolean, release: boolean) => void;

class Bang {
  private bangs: Bang[] = [];
  private output: BangCallback;

  constructor(output?: BangCallback) {
    this.output = output;
  }

  public connect(bang: Bang): void {
    this.bangs = [...this.bangs, bang];
  }

  public disconnect(bang: Bang): void {
    this.bangs = this.bangs.filter((item) => item !== bang);
  }

  public bang(time: number, attack = false, release = false): void {
    this.bangs.forEach((item) => {
      item.trigger(time, attack, release);
    });
  }

  public trigger(time: number, attack = false, release = false): void {
    this.output(time, attack, release);
  }
}

export default Bang;
