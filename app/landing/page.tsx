"use client";
import React, { useRef, useEffect } from 'react';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../../app/app.css";
import "./style.css";

// Constantes para la distancia de la órbita y cantidad de gemas
const ORBIT_RADIUS = 2;
const GEM_COUNT = 6; // Total de gemas: 3 diamantes + 2 rubíes

export default function Landing() {

  useEffect(() => {
    gsap.to([".content h1", ".content p"], {
      y: 0,
      duration: 1,
      delay: 1
    });

    gsap.to(".init-btn", {
      opacity: 1,
      duration: 1,
      delay: 2
    });
  }, []);


  return (
    <>
    <Canvas className='webgl' camera={{
      position: [0, 5, 7],
    }}>
      <OrbitControls enablePan={false} maxDistance={11} minDistance={4}/>
      <Environment preset="sunset" />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Star position={[0, 0, 0]} scale={2}/>
      {Array.from({ length: GEM_COUNT }, (_, i) => 
        i % 2 === 0 ? <Ruby key={i} index={i} /> : <Diamond key={i} index={i} />
      )}
    </Canvas>

    <div className="content">
      <div className='mask'>
      <h1>¡Recompensas!</h1>

      </div>
      <div className='mask'>

      <p>¡Descubre las gemas ocultas que tenemos para ti!</p>
      </div>
    </div>

    <button className='init-btn'>
      <a href="/">Descubre más</a>
    </button>
    </>
  );
}

function Star(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/star.gltf');

  // Rotación constante de la estrella
  useFrame(() => (group.current.rotation.y += 0.01));

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh geometry={nodes.star.geometry} material={materials['Yellow.030']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

function Diamond({ index }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/diamond.gltf');

  // Calcular el ángulo inicial y la posición de la órbita
  const angle = (index / GEM_COUNT) * Math.PI * 2;
  const position = [ORBIT_RADIUS * Math.cos(angle), 0, ORBIT_RADIUS * Math.sin(angle)];

  useEffect(() => {
    if (!group.current.scale) return;

    gsap.to(group.current.scale, {
      x: 0.5,
      y: 0.5,
      z: 0.5,
      duration: 1,
      delay: index * 0.3
    });
  }, []);

  useOrbitAnimation(group, angle);

  return (
    <group ref={group} position={position} dispose={null} scale={0}>
      <mesh geometry={nodes.Diamond.geometry} material={materials.Material} />
    </group>
  );
}

function Ruby({ index }) {
  const group = useRef();
  const { nodes, materials } = useGLTF('/models/ruby.gltf');

  // Calcular el ángulo inicial y la posición de la órbita
  const angle = (index / GEM_COUNT) * Math.PI * 2;
  const position = [ORBIT_RADIUS * Math.cos(angle), 0, ORBIT_RADIUS * Math.sin(angle)];

  useEffect(() => {
    if (!group.current.scale) return;

    gsap.to(group.current.scale, {
      x: 0.5,
      y: 0.5,
      z: 0.5,
      duration: 1,
      delay: index * 0.3
    });
  }, []); 

  useOrbitAnimation(group, angle);

  return (
    <group ref={group} position={position} dispose={null} scale={0}>
      <mesh geometry={nodes.Ruby.geometry} material={materials.Material} />
    </group>
  );
}

// Función para aplicar la animación de órbita con GSAP
function useOrbitAnimation(ref, initialAngle) {
  useEffect(() => {
    gsap.to(ref.current.rotation, {
      y: `+=${Math.PI * 2}`,
      duration: 10,
      repeat: -1,
      ease: "linear"
    });
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    ref.current.position.x = ORBIT_RADIUS * Math.cos(initialAngle + elapsedTime * 0.5);
    ref.current.position.z = ORBIT_RADIUS * Math.sin(initialAngle + elapsedTime * 0.5);
  });
}

// Preload de los modelos
useGLTF.preload('/models/star.gltf');
useGLTF.preload('/models/diamond.gltf');
useGLTF.preload('/models/ruby.gltf');
