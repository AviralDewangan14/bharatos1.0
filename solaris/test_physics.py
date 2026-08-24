import math
import sys

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from solaris.physics import Vector2D, CelestialBody, Spacecraft, G_CONSTANT

def test_vector_operations():
    v1 = Vector2D(3.0, 4.0)
    assert v1.magnitude() == 5.0
    v_norm = v1.normalize()
    assert abs(v_norm.magnitude() - 1.0) < 1e-5
    v2 = Vector2D(1.0, 2.0)
    v_add = v1 + v2
    assert v_add.x == 4.0 and v_add.y == 6.0
    print("✓ Vector arithmetic tests passed")

def test_orbital_gravity_and_escape_velocity():
    star = CelestialBody("Sun", Vector2D(0, 0), mass=5000.0, radius=50.0)
    radius = 300.0
    v_circ = star.calculate_orbital_velocity(radius)
    v_esc = star.calculate_escape_velocity(radius)
    
    # Escape velocity is exactly sqrt(2) * circular velocity
    ratio = v_esc / v_circ
    assert abs(ratio - math.sqrt(2.0)) < 1e-4
    print(f"✓ Orbital mechanics: Circular speed={v_circ:.2f}, Escape speed={v_esc:.2f} (Ratio={ratio:.4f})")

def test_spacecraft_integration():
    star = CelestialBody("Sun", Vector2D(0, 0), mass=5000.0, radius=50.0)
    ship = Spacecraft(Vector2D(200.0, 0.0))
    # Apply thrust
    ship.apply_thrust(0.1)
    assert ship.fuel < 100.0
    
    # Step physics integration
    ship.integrate(0.1, [star])
    assert ship.position.x != 200.0 or ship.position.y != 0.0
    print("✓ Spacecraft thrust and gravitational integration tests passed")

if __name__ == "__main__":
    print("========================================")
    print(" Running Solaris Physics Unit Tests")
    print("========================================")
    test_vector_operations()
    test_orbital_gravity_and_escape_velocity()
    test_spacecraft_integration()
    print("========================================")
    print(" ✅ ALL SOLARIS UNIT TESTS PASSED!")
    print("========================================")
