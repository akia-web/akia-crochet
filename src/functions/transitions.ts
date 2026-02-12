export const enterTransition = (element: Element) => {
  const el = element  as HTMLElement;
  el.style.height = '0';
  el.style.opacity = '0';
  el.offsetHeight;
  el.style.transition = 'all 0.35s ease';
  el.style.height = el.scrollHeight + 'px';
  el.style.opacity = '1';
}

export const leaveTransition = (element: Element) => {
  const el = element  as HTMLElement;
  el.style.height = el.scrollHeight + 'px';
  el.offsetHeight;
  el.style.transition = 'all 0.15s ease';
  el.style.height = '0';
  el.style.opacity = '0';
}