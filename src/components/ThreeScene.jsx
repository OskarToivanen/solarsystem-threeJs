import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createOrbitLine from '../utils/CreateOrbitLine'
import createRotationAxisLine from '../utils/CreateRotationAxis'

const ThreeScene = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 50, 400)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // Enable damping (inertia)
    controls.dampingFactor = 0.25 // Damping factor
    controls.enableZoom = true // Enable zooming

    const planets = [
      {
        radius: 15,
        distance: 0,
        color: 0xffcc00,
        speed: 0,
        texture: '/src/assets/sun.jpg',
      }, // Sun
      {
        radius: 2.4,
        distance: 40,
        color: 0xffdd44,
        speed: 0.0004,
        texture: '/src/assets/mercury.jpg',
      }, // Mercury
      {
        radius: 6,
        distance: 80,
        color: 0xeecc99,
        speed: 0.00016,
        texture: '/src/assets/venus.jpg',
      }, // Venus
      {
        radius: 6.4,
        distance: 120,
        color: 0xaf47d2,
        speed: 0.0001,
        texture: '/src/assets/earth.jpg',
      }, // Earth
      {
        radius: 3.4,
        distance: 160,
        color: 0xff3333,
        speed: 0.00008,
        texture: '/src/assets/mars.jpg',
      }, // Mars
      {
        radius: 13,
        distance: 220,
        color: 0xffaa33,
        speed: 0.00004,
        texture: '/src/assets/jupiter.jpg',
      }, // Jupiter
      {
        radius: 11,
        distance: 280,
        color: 0xffaa77,
        speed: 0.00003,
        texture: '/src/assets/saturn.jpg',
      }, // Saturn
      {
        radius: 5,
        distance: 340,
        color: 0x33ccff,
        speed: 0.00001,
        texture: '../assets/uranus.jpg',
      }, // Uranus
      {
        radius: 5,
        distance: 400,
        color: 0x3333ff,
        speed: 0.00001,
        texture: '../assets/neptune.jpg',
      }, // Neptune
      {
        radius: 1.2,
        distance: 460,
        color: 0x999999,
        speed: 0.000007,
        texture: '../assets/pluto.jpg',
      }, // Pluto
    ]

    const orbitCenters = []
    planets.forEach((planet) => {
      const geometry = new THREE.SphereGeometry(
        planet.radius,
        40,
        32,
        0,
        6.3,
        0,
        4
      )
      const texture = new THREE.TextureLoader().load(planet.texture)
      const material = new THREE.MeshPhongMaterial({
        map: texture,
      })
      const sphere = new THREE.Mesh(geometry, material)

      const orbitCenter = new THREE.Object3D()
      orbitCenter.add(sphere)

      // Add rotation axis line
      const rotationAxisLine = createRotationAxisLine(planet.radius)
      sphere.add(rotationAxisLine)

      sphere.position.set(planet.distance, 0, 0)

      orbitCenter.rotation.y = Math.random() * 2 * Math.PI

      scene.add(orbitCenter)
      orbitCenters.push({
        orbitCenter,
        speed: planet.speed,
      })

      // Create and add orbit line
      const orbitLine = createOrbitLine(planet.distance)
      orbitLine.rotation.x = Math.PI / 2
      scene.add(orbitLine)
    })

    const ambientLight = new THREE.AmbientLight(0x404040) // Soft white light
    scene.add(ambientLight)

    // Adding a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    const animate = () => {
      requestAnimationFrame(animate)
      orbitCenters.forEach(({ orbitCenter, speed }) => {
        orbitCenter.rotation.y += speed
      })
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
      mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef}></div>
}

export default ThreeScene
