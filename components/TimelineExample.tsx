'use client';

import {
  DOMKeyframesDefinition,
  ElementOrSelector,
  useAnimate,
  AnimationOptions,
} from 'framer-motion';
import { useEffect, useRef } from 'react';

const TRANSITION: AnimationOptions = {
  ease: 'easeInOut',
  duration: 0.5,
};

export default function TimelineExample() {
  const scope = useMotionTimeLine(
    [
      ['.bar-2', { height: 48 }, TRANSITION],
      [
        ['.bar-1', { x: -24 }, TRANSITION],
        ['.bar-3', { x: 24 }, TRANSITION],
      ],
      [
        ['.bar-1', { height: 48, rotate: 90 }, TRANSITION],
        ['.bar-3', { height: 48, rotate: -90 }, TRANSITION],
      ],
      [
        ['.bar-1', { x: 48 }, TRANSITION],
        ['.bar-3', { x: -48 }, TRANSITION],
      ],
      [
        ['.bar-1', { rotate: 120, background: '#059669' }, TRANSITION],
        ['.bar-2', { rotate: -120, background: '#34d399' }, TRANSITION],
        ['.bar-3', { rotate: 90 }, TRANSITION],
      ],
      [
        [
          '.bar-1',
          { rotate: 0, x: 0, height: 96, background: '#FFFFFF' },
          { ...TRANSITION, delay: 2 },
        ],
        [
          '.bar-2',
          { rotate: 0, height: 96, background: '#FFFFFF' },
          { ...TRANSITION, delay: 2 },
        ],
        [
          '.bar-3',
          { rotate: 0, x: 0, height: 96, background: '#FFFFFF' },
          { ...TRANSITION, delay: 2 },
        ],
      ],
    ],
    Infinity
  );

  return (
    <div
      ref={scope}
      className='flex min-h-screen items-center justify-center overflow-hidden'
    >
      <div style={{ width: 48, height: 96 }} className='bar-1 bg-white' />
      <div style={{ width: 48, height: 96 }} className='bar-2 bg-white' />
      <div style={{ width: 48, height: 96 }} className='bar-3 bg-white' />
    </div>
  );
}

type AnimateParams = [
  ElementOrSelector,
  DOMKeyframesDefinition,
  AnimationOptions?
];
type Animation = AnimateParams | Animation[];

const useMotionTimeLine = (Keyframes: Animation[], count: number = 1) => {
  const mounted = useRef(true);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    mounted.current = true;
    animate('.bar-2', { height: 48 });

    handleAnimate();

    return () => {
      mounted.current = false;
    };
  }, [animate]);

  const processAnimation = async (animation: Animation) => {
    if (Array.isArray(animation[0])) {
      await Promise.all(
        (animation as AnimateParams[]).map(async (a) => {
          await processAnimation(a);
        })
      );
    } else {
      await animate(...(animation as AnimateParams));
    }
  };

  const handleAnimate = async () => {
    for (let i = 0; i < count; i++) {
      for (const step of Keyframes) {
        if (!mounted.current) return;

        await processAnimation(step);
      }
    }
  };

  return scope;
};
