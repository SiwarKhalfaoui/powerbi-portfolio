import { useEffect, useRef } from 'react';


export function GradientMeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return; 

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return; // static CSS fallback stays visible

    const vertexSrc = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;


    const fragmentSrc = `
      precision mediump float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;

      vec3 blob(vec2 uv, vec2 center, vec3 color, float radius) {
        float d = distance(uv, center);
        float glow = smoothstep(radius, 0.0, d);
        return color * glow;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        uv.x *= uResolution.x / uResolution.y;
        vec2 mouse = uMouse;
        mouse.x *= uResolution.x / uResolution.y;

        float t = uTime * 0.05;

        float aspect = uResolution.x / uResolution.y;
        vec2 c1 = vec2((0.15 + sin(t) * 0.08) * aspect, 0.75 + cos(t * 0.8) * 0.06) + (mouse - 0.5) * 0.04;
        vec2 c2 = vec2((0.85 + cos(t * 0.7) * 0.08) * aspect, 0.65 + sin(t * 0.9) * 0.07) + (mouse - 0.5) * 0.05;
        vec2 c3 = vec2((0.55 + sin(t * 0.6) * 0.1) * aspect, 0.15 + cos(t * 0.5) * 0.05) + (mouse - 0.5) * 0.03;

        vec3 teal = vec3(0.133, 0.827, 0.706);
        vec3 violet = vec3(0.545, 0.486, 0.965);
        vec3 amber = vec3(0.961, 0.651, 0.137);

        vec3 color = vec3(0.0);
        color += blob(uv, c1, teal, 0.55);
        color += blob(uv, c2, violet, 0.6);
        color += blob(uv, c3, amber, 0.4);

        float alpha = clamp(length(color) * 0.4, 0.0, 0.22);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function compile(type: number, src: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSrc));
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // Compilation failed on this device/driver — bail out quietly and
      // let the static CSS gradient fallback carry the background.
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const mouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    function handleMouseMove(e: MouseEvent) {
      targetMouse = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
    }
    if (isFinePointer) window.addEventListener('mousemove', handleMouseMove);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR — perf over sharpness
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
    }
    resize();
    window.addEventListener('resize', resize);

    let animationFrame: number;
    let visible = true;
    const handleVisibility = () => {
      visible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const start = performance.now();
    function render(now: number) {
      animationFrame = requestAnimationFrame(render);
      if (!visible) return; // pause work when the tab is backgrounded

      mouse.x += (targetMouse.x - mouse.x) * 0.03;
      mouse.y += (targetMouse.y - mouse.y) * 0.03;

      gl!.uniform2f(uResolution, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, (now - start) / 1000);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      
      <div className="absolute inset-0 bg-mesh-light" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </>
  );
}