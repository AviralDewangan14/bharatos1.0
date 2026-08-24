"""
Orbital Physics Simulation Module.
Implements Newtonian N-body gravitational mechanics, orbital velocity calculations,
and collision resolution for the Solaris Engine.
"""

import math
from typing import List, Tuple, Dict, Any

# Gravitational constant scaled for 2D arcade physics
G_CONSTANT = 600.0

class Vector2D:
    """2D Vector utility with vector arithmetic."""
    def __init__(self, x: float = 0.0, y: float = 0.0):
        self.x = float(x)
        self.y = float(y)

    def __add__(self, other: 'Vector2D') -> 'Vector2D':
        return Vector2D(self.x + other.x, self.y + other.y)

    def __sub__(self, other: 'Vector2D') -> 'Vector2D':
        return Vector2D(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar: float) -> 'Vector2D':
        return Vector2D(self.x * scalar, self.y * scalar)

    def magnitude(self) -> float:
        return math.hypot(self.x, self.y)

    def magnitude_squared(self) -> float:
        return self.x * self.x + self.y * self.y

    def normalize(self) -> 'Vector2D':
        mag = self.magnitude()
        if mag > 1e-6:
            return Vector2D(self.x / mag, self.y / mag)
        return Vector2D(0.0, 0.0)

    def dot(self, other: 'Vector2D') -> float:
        return self.x * other.x + self.y * other.y


class CelestialBody:
    """Represents a massive gravitational body (star, planet, black hole)."""
    def __init__(self, name: str, position: Vector2D, mass: float, radius: float, color: str = "#ffaa00"):
        self.name = name
        self.position = position
        self.mass = mass
        self.radius = radius
        self.color = color

    def calculate_gravitational_pull(self, target_pos: Vector2D, softening: float = 20.0) -> Vector2D:
        """Calculates gravitational acceleration vector exerted on target position."""
        diff = self.position - target_pos
        dist_sq = diff.magnitude_squared() + softening * softening
        dist = math.sqrt(dist_sq)

        # F = G * M / r^2
        force_magnitude = (G_CONSTANT * self.mass) / dist_sq
        direction = diff.normalize()
        return direction * force_magnitude

    def calculate_orbital_velocity(self, radius: float) -> float:
        """Calculates stable circular orbital speed: v = sqrt(G*M / r)."""
        if radius <= 0:
            return 0.0
        return math.sqrt((G_CONSTANT * self.mass) / radius)

    def calculate_escape_velocity(self, radius: float) -> float:
        """Calculates escape velocity: v_esc = sqrt(2*G*M / r)."""
        if radius <= 0:
            return 0.0
        return math.sqrt((2.0 * G_CONSTANT * self.mass) / radius)


class Spacecraft:
    """Player controlled spacecraft with thrusters and orbital mechanics."""
    def __init__(self, position: Vector2D, mass: float = 1.0):
        self.position = position
        self.velocity = Vector2D(0.0, 0.0)
        self.acceleration = Vector2D(0.0, 0.0)
        self.heading_radians = -math.pi / 2.0  # Pointing upwards
        self.mass = mass
        self.fuel = 100.0
        self.shields = 100.0
        self.thrust_power = 220.0
        self.rotation_speed = 3.5  # rad/sec
        self.is_thrusting = False

    def apply_thrust(self, dt: float) -> None:
        """Applies directional thruster force consuming fuel."""
        if self.fuel > 0:
            thrust_dir = Vector2D(math.cos(self.heading_radians), math.sin(self.heading_radians))
            self.acceleration = self.acceleration + (thrust_dir * (self.thrust_power / self.mass))
            self.fuel = max(0.0, self.fuel - 12.0 * dt)
            self.is_thrusting = True
        else:
            self.is_thrusting = False

    def rotate(self, direction: float, dt: float) -> None:
        """Rotates ship heading: direction is -1 (left) or +1 (right)."""
        self.heading_radians += direction * self.rotation_speed * dt

    def integrate(self, dt: float, celestial_bodies: List[CelestialBody]) -> None:
        """Verlet integration step combining gravity wells and thrust."""
        # 1. Sum gravitational pull from all celestial bodies
        total_gravity = Vector2D(0.0, 0.0)
        for body in celestial_bodies:
            total_gravity = total_gravity + body.calculate_gravitational_pull(self.position)

        total_accel = self.acceleration + total_gravity

        # 2. Update velocity and position
        self.velocity = self.velocity + (total_accel * dt)
        self.position = self.position + (self.velocity * dt)

        # 3. Reset per-frame acceleration
        self.acceleration = Vector2D(0.0, 0.0)
        self.is_thrusting = False
