import * as THREE from 'three'

export default function createRotationAxisLine(radius) {
  const points = [
    new THREE.Vector3(0, -radius * 1.5, 0),
    new THREE.Vector3(0, radius * 1.5, 0),
  ]

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
  return new THREE.Line(geometry, material)
}
