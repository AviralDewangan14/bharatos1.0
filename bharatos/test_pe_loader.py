"""
Unit Tests for Kavach WinBridge Windows .EXE PE32/PE32+ Binary Compatibility Layer.
"""

import sys
import struct

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from bharatos.winbridge.pe_parser import PEHeaderParser, winbridge
from bharatos.fs.sovereign_fs import sovereign_fs

def generate_synthetic_pe_binary() -> bytes:
    """Creates a minimal syntax-valid 64-bit PE32+ executable header."""
    data = bytearray(1024)
    # DOS Header
    data[0:2] = b"MZ"
    struct.pack_into("<I", data, 0x3C, 0x80)  # e_lfanew -> 0x80

    # PE Signature
    data[0x80:0x84] = b"PE\x00\x00"

    # COFF File Header (Machine: x86_64 = 0x8664, 2 sections)
    struct.pack_into("<HHIIIHH", data, 0x84, 0x8664, 2, 0, 0, 0, 0xF0, 0x02)

    # Optional Header (PE32+ magic: 0x20B, Entry: 0x1000, Base: 0x140000000)
    struct.pack_into("<H", data, 0x98, 0x20B)
    struct.pack_into("<IIQII", data, 0x98 + 16, 0x1000, 0x1000, 0x140000000, 0x1000, 0x200)

    # Section 1: .text
    sec1_off = 0x98 + 0xF0
    struct.pack_into("<8sIIII", data, sec1_off, b".text\x00\x00\x00", 0x500, 0x1000, 0x600, 0x400)
    struct.pack_into("<I", data, sec1_off + 36, 0x60000020)  # Code, Executable, Readable

    # Section 2: .data
    sec2_off = sec1_off + 40
    struct.pack_into("<8sIIII", data, sec2_off, b".data\x00\x00\x00", 0x200, 0x2000, 0x200, 0xA00)
    struct.pack_into("<I", data, sec2_off + 36, 0xC0000040)  # Data, Readable, Writable

    return bytes(data)

def test_pe_parsing():
    raw_exe = generate_synthetic_pe_binary()
    parser = PEHeaderParser(raw_exe)
    assert parser.parse() is True
    assert parser.is_64bit is True
    assert parser.file_header["machine"] == "x86_64"
    assert len(parser.sections) == 2
    assert parser.sections[0]["name"] == ".text"
    assert parser.sections[1]["name"] == ".data"
    print("✓ Windows PE32+ (x86_64) Header Parsing Passed")

def test_winbridge_execution():
    raw_exe = generate_synthetic_pe_binary()
    res = winbridge.load_exe("solaris_space_game.exe", raw_exe)
    assert res["success"] is True
    assert "solaris_space_game.exe" in winbridge.loaded_binaries
    
    # Test Win32 syscall translation
    out = winbridge.execute_mock_win32_call("MessageBoxA", ["Solaris", "Welcome to BharatOS WinBridge"])
    assert out["result"] == "IDOK"
    print("✓ Kavach WinBridge Win32 API Emulation Passed")

def test_sovereign_fs():
    res = sovereign_fs.create_file(1, "app.exe", b"MZ_EXECUTABLE_DATA_IN_SOVEREIGN_FS")
    assert res["success"] is True
    read_back = sovereign_fs.read_file(res["inode_id"])
    assert read_back == b"MZ_EXECUTABLE_DATA_IN_SOVEREIGN_FS"
    print("✓ SovereignFS Block Allocation & Read/Write Passed")

if __name__ == "__main__":
    print("====================================================================")
    print(" Running BharatOS WinBridge & SovereignFS Test Suite")
    print("====================================================================")
    test_pe_parsing()
    test_winbridge_execution()
    test_sovereign_fs()
    print("====================================================================")
    print(" ✅ ALL WINBRIDGE & SOVEREIGN FS TESTS PASSED!")
    print("====================================================================")
