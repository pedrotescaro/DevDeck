'use client';

import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useMemo, useRef, type HTMLAttributes } from 'react';
import styles from './FaultyTerminal.module.css';

type Vec2 = [number, number];

export interface FaultyTerminalProps extends HTMLAttributes<HTMLDivElement> {
  scale?: number;
  gridMul?: Vec2;
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  dpr?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseVelocity;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;

float time;

float hash21(vec2 p) {
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2;
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;

  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;

  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;

  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);

  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);

  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

float digit(vec2 p) {
  vec2 grid = uGridMul * 15.0;
  vec2 s = floor(p * grid) / grid;
  p = p * grid;
  vec2 q;
  vec2 r;
  float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;

  if (uUseMouse > 0.5) {
    vec2 mouseWorld = uMouse * uScale;
    float distToMouse = distance(s, mouseWorld);
    float reaction = 1.0 + min(uMouseVelocity, 1.5) * 0.65;
    float mouseInfluence = exp(-distToMouse * 5.5) * uMouseStrength * 7.0 * reaction;
    float core = exp(-distToMouse * 24.0) * uMouseStrength * (0.7 + uMouseVelocity * 0.6);
    float ripple = sin(distToMouse * 28.0 - iTime * 7.0) * 0.16 * mouseInfluence;
    intensity += mouseInfluence + core + ripple;
  }

  if (uUsePageLoadAnimation > 0.5) {
    float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
    float cellDelay = cellRandom * 0.8;
    float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
    float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
    intensity *= fadeAlpha;
  }

  p = fract(p);
  p *= uDigitSize;

  float px5 = p.x * 5.0;
  float py5 = (1.0 - p.y) * 5.0;
  float x = fract(px5);
  float y = fract(py5);
  float i = floor(py5) - 2.0;
  float j = floor(px5) - 2.0;
  float n = i * i + j * j;
  float f = n * 0.0625;
  float isOn = step(0.1, intensity - f);
  float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);

  return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

float onOff(float a, float b, float c) {
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look) {
  float y = look.y - mod(iTime * 0.25, 1.0);
  float window = 1.0 / (1.0 + 50.0 * y * y);
  return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8)
    * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p) {
  float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
  bar *= uScanlineIntensity;

  float displacement = displace(p);
  p.x += displacement;

  if (uGlitchAmount != 1.0) {
    float extra = displacement * (uGlitchAmount - 1.0);
    p.x += extra;
  }

  float middle = digit(p);
  const float off = 0.002;
  float glow =
    digit(p + vec2(-off, 0.0)) +
    digit(p + vec2(off, 0.0)) +
    digit(p + vec2(0.0, -off)) +
    digit(p + vec2(0.0, off));

  return vec3(0.96) * middle + glow * 0.08 * vec3(1.0) * bar;
}

vec2 barrel(vec2 uv) {
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
  time = iTime * 0.333333;
  vec2 uv = vUv;

  if (uCurvature != 0.0) {
    uv = barrel(uv);
  }

  vec2 p = uv * uScale;
  vec3 col = getColor(p);

  if (uChromaticAberration != 0.0) {
    vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
    col.r = getColor(p + ca).r;
    col.b = getColor(p - ca).b;
  }

  col *= uTint;
  col *= uBrightness;

  if (uDither > 0.0) {
    float rnd = hash21(gl_FragCoord.xy);
    col += (rnd - 0.5) * (uDither * 0.003922);
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let normalized = hex.replace('#', '').trim();

  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((character) => character + character)
      .join('');
  }

  const value = Number.parseInt(normalized.slice(0, 6), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export default function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0.2,
  tint = '#ffffff',
  mouseReact = true,
  mouseStrength = 0.2,
  dpr,
  pageLoadAnimation = true,
  brightness = 1,
  className = '',
  ...rest
}: FaultyTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseVelocityRef = useRef(0);
  const lastPointerRef = useRef({ x: 0.5, y: 0.5, time: 0 });
  const frozenTimeRef = useRef(0);
  const rafRef = useRef(0);
  const loadAnimationStartRef = useRef(0);
  const timeOffsetRef = useRef(Math.random() * 100);

  const tintVec = useMemo(() => hexToRgb(tint), [tint]);
  const ditherValue = useMemo(
    () => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither),
    [dither]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const defaultDpr = window.matchMedia('(pointer: coarse)').matches ? 1 : 1.35;
    const renderer = new Renderer({
      dpr: dpr ?? Math.min(window.devicePixelRatio || 1, defaultDpr),
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array(gridMul) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uMouse: {
          value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y]),
        },
        uMouseStrength: { value: mouseStrength },
        uMouseVelocity: { value: 0 },
        uUseMouse: { value: mouseReact ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    let lastWidth = 0;
    let lastHeight = 0;
    let isIntersecting = true;
    let isDocumentVisible = document.visibilityState === 'visible';
    let isRendering = false;

    const resize = () => {
      const width = Math.round(container.offsetWidth);
      const height = Math.round(container.offsetHeight);
      if (!width || !height || (width === lastWidth && height === lastHeight)) return;

      lastWidth = width;
      lastHeight = height;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const update = (timeStamp: number) => {
      if (!isIntersecting || !isDocumentVisible) {
        isRendering = false;
        return;
      }

      rafRef.current = requestAnimationFrame(update);

      if (pageLoadAnimation && loadAnimationStartRef.current === 0) {
        loadAnimationStartRef.current = timeStamp;
      }

      if (pause) {
        program.uniforms.iTime.value = frozenTimeRef.current;
      } else {
        const elapsed = (timeStamp * 0.001 + timeOffsetRef.current) * timeScale;
        program.uniforms.iTime.value = elapsed;
        frozenTimeRef.current = elapsed;
      }

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const animationElapsed = timeStamp - loadAnimationStartRef.current;
        program.uniforms.uPageLoadProgress.value = Math.min(animationElapsed / 2000, 1);
      }

      if (mouseReact) {
        const smoothMouse = smoothMouseRef.current;
        const mouse = mouseRef.current;
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;

        const mouseUniform = program.uniforms.uMouse.value as Float32Array;
        mouseUniform[0] = smoothMouse.x;
        mouseUniform[1] = smoothMouse.y;
        program.uniforms.uMouseVelocity.value = mouseVelocityRef.current;
        mouseVelocityRef.current *= 0.92;
      }

      renderer.render({ scene: mesh });
    };

    const startRendering = () => {
      if (isRendering || !isIntersecting || !isDocumentVisible) return;
      isRendering = true;
      rafRef.current = requestAnimationFrame(update);
    };

    const stopRendering = () => {
      if (!isRendering) return;
      cancelAnimationFrame(rafRef.current);
      isRendering = false;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const nextX = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const nextY = 1 - Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      const now = performance.now();
      const lastPointer = lastPointerRef.current;

      if (lastPointer.time > 0) {
        const elapsed = Math.max((now - lastPointer.time) / 1000, 1 / 120);
        const distance = Math.hypot(nextX - lastPointer.x, nextY - lastPointer.y);
        mouseVelocityRef.current = Math.min(distance / elapsed, 2);
      }

      mouseRef.current = { x: nextX, y: nextY };
      lastPointerRef.current = { x: nextX, y: nextY, time: now };
      startRendering();
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === 'visible';
      if (isDocumentVisible) startRendering();
      else stopRendering();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? true;
        if (isIntersecting) startRendering();
        else stopRendering();
      },
      { rootMargin: '160px 0px' }
    );

    container.appendChild(gl.canvas);
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (mouseReact) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      stopRendering();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);

      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }

      gl.getExtension('WEBGL_lose_context')?.loseContext();
      loadAnimationStartRef.current = 0;
      timeOffsetRef.current = Math.random() * 100;
    };
  }, [
    brightness,
    chromaticAberration,
    curvature,
    digitSize,
    ditherValue,
    dpr,
    flickerAmount,
    glitchAmount,
    gridMul,
    mouseReact,
    mouseStrength,
    noiseAmp,
    pageLoadAnimation,
    pause,
    scale,
    scanlineIntensity,
    timeScale,
    tintVec,
  ]);

  return <div ref={containerRef} className={`${styles.container} ${className}`.trim()} {...rest} />;
}
