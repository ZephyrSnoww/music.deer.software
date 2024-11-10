import gsap from "gsap";

export function fadeTransitionIn(node: Element) {
  const tl = gsap.timeline();
  const duration = 0.25;

  tl.from(node, {
    duration, opacity: 0,
    ease: "power2.out"
  });

  return {
    duration: tl.totalDuration() * 1000,
    tick: (t: number) => {
      tl.progress(t);
    }
  }
}

export function fadeTransitionOut(node: Element) {
  const tl = gsap.timeline();
  const duration = 0.25;

  tl.from(node, {
    duration, opacity: 0,
    ease: "power2.in"
  });

  return {
    duration: tl.totalDuration() * 1000,
    tick: (t: number) => {
      tl.progress(t);
    }
  }
}

export function subnavTransitionIn(node: Element) {
  const tl = gsap.timeline();
  const duration = 0.25;

  tl.from(node, {
    duration, opacity: 0,
    x: "-50",
    ease: "power2.out"
  });

  return {
    duration: tl.totalDuration() * 1000,
    tick: (t: number) => {
      tl.progress(t);
    }
  }
}

export function subnavTransitionOut(node: Element) {
  const tl = gsap.timeline();
  const duration = 0.25;

  tl.from(node, {
    duration, opacity: 0,
    x: "-50",
    ease: "power2.in"
  });

  return {
    duration: tl.totalDuration() * 1000,
    tick: (t: number) => {
      tl.progress(t);
    }
  }
}
