class Timer {
  static STATUSES = {
    INITIALISED: 1,
    RUNNING: 2,
    PAUSED: 3,
    STOPPED: 4,
  };

  constructor({ callbacks = { timeChanged: (_) => null, statusChanged: (_) => null } } = {}) {
    this.lastRead = 0;
    this.timeElapsed = 0;
    this.callbacks = callbacks;
    this.setStatus("INITIALISED");
  }

  setStatus = (status) => {
    this.status = Timer.STATUSES[status];
    this.callbacks.statusChanged(this.status);
  };

  isInStatus = (status) => this.status === Timer.STATUSES[status];

  syncTimer() {
    const now = performance.now();
    const elapsed = now - this.lastRead;
    this.lastRead = performance.now();
    this.timeElapsed += elapsed;
    this.callbacks.timeChanged(elapsed);
  }

  start() {
    if (!this.isInStatus("INITIALISED") && !this.isInStatus("PAUSED")) return;
    this.lastRead = performance.now();
    this.interval = setInterval(() => this.syncTimer(), 100);
    this.setStatus("RUNNING");
  }

  pause() {
    if (!this.isInStatus("RUNNING")) return;
    clearInterval(this.interval);
    this.syncTimer();
    this.setStatus("PAUSED");
  }

  reset() {
    if (!this.isInStatus("PAUSED") && !this.isInStatus("STOPPED")) return;
    this.lastRead = 0;
    this.timeElapsed = 0;
    this.callbacks.timeChanged(0);
    this.setStatus("INITIALISED");
  }

  stop() {
    if (this.isInStatus("INITIALISED")) return;
    clearInterval(this.interval);
    this.syncTimer();
    this.setStatus("STOPPED");
  }
}
