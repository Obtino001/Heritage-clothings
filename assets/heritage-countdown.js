class HeritageCountdown extends HTMLElement {
  connectedCallback() {
    const raw = this.dataset.end || '';
    const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
    const withSeconds = /T\d{2}:\d{2}$/.test(normalized) ? `${normalized}:00` : normalized;
    this.endAt = Date.parse(withSeconds);

    this.daysEl = this.querySelector('[data-days]');
    this.hoursEl = this.querySelector('[data-hours]');
    this.minutesEl = this.querySelector('[data-minutes]');
    this.secondsEl = this.querySelector('[data-seconds]');
    this.endedEl = this.querySelector('.hc-countdown__ended');

    if (!this.endAt) {
      this.hidden = true;
      return;
    }

    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.timer);
  }

  pad(value) {
    return String(Math.max(0, value)).padStart(2, '0');
  }

  tick() {
    const diff = this.endAt - Date.now();

    if (diff <= 0) {
      this.classList.add('is-ended');
      if (this.endedEl) this.endedEl.hidden = false;
      if (this.dataset.hideEnded !== 'false') this.hidden = true;
      clearInterval(this.timer);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (this.daysEl) this.daysEl.textContent = this.pad(days);
    if (this.hoursEl) this.hoursEl.textContent = this.pad(hours);
    if (this.minutesEl) this.minutesEl.textContent = this.pad(minutes);
    if (this.secondsEl) this.secondsEl.textContent = this.pad(seconds);
  }
}

if (!customElements.get('heritage-countdown')) {
  customElements.define('heritage-countdown', HeritageCountdown);
}
