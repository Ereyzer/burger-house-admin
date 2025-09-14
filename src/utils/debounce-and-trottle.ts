export function myDebounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  t: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, t);
  };
}

export function myTrottle() {}
