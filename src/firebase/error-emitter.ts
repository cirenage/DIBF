'use client';

type ErrorEvent = 'permission-error';

class ErrorEmitter {
  private listeners: Record<string, Array<(error: any) => void>> = {};

  on(event: ErrorEvent, callback: (error: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(l => l !== callback);
    };
  }

  emit(event: ErrorEvent, error: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(error));
    }
  }
}

export const errorEmitter = new ErrorEmitter();
