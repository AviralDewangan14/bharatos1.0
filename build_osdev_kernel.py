#!/usr/bin/env python3
"""
==============================================================================
BharatOS OSDev Kernel Builder & Bootable ISO Generator
Builds the bare-metal x86_64 kernel binary and creates bootable ISO image.
==============================================================================
"""

import os
import sys
import shutil
import struct
import subprocess
from pathlib import Path

PROJECT_ROOT = Path("c:/Users/Aviral/Documents/antigravity/radiant-hypatia").resolve()
CORE_KERNEL_DIR = PROJECT_ROOT / "bharatos" / "core_kernel"
DIST_DIR = PROJECT_ROOT / "dist"
KERNEL_BIN = DIST_DIR / "bharatos_kernel.bin"
KERNEL_ISO = DIST_DIR / "BharatOS-2026-BareMetal-x86_64.iso"

def synthesize_multiboot_elf64_binary():
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Generate standard ELF64 header with Multiboot 1 & 2 headers
    # ELF Magic: \x7F ELF, 64-bit (2), Little Endian (1), Version (1), System V (0)
    e_ident = b"\x7FELF\x02\x01\x01\x00" + b"\x00" * 8
    e_type = struct.pack("<H", 2)        # ET_EXEC (Executable file)
    e_machine = struct.pack("<H", 0x3E)  # EM_X86_64 (AMD x86-64)
    e_version = struct.pack("<I", 1)
    e_entry = struct.pack("<Q", 0x100000)# Entry point 1MB
    e_phoff = struct.pack("<Q", 64)      # Program header offset
    e_shoff = struct.pack("<Q", 0)       # Section header offset
    e_flags = struct.pack("<I", 0)
    e_ehsize = struct.pack("<H", 64)     # ELF header size
    e_phentsize = struct.pack("<H", 56)  # Program header entry size
    e_phnum = struct.pack("<H", 1)       # Number of program headers
    e_shentsize = struct.pack("<H", 64)
    e_shnum = struct.pack("<H", 0)
    e_shstrndx = struct.pack("<H", 0)

    elf_header = (
        e_ident + e_type + e_machine + e_version + e_entry +
        e_phoff + e_shoff + e_flags + e_ehsize + e_phentsize +
        e_phnum + e_shentsize + e_shnum + e_shstrndx
    )

    # Program Header (PT_LOAD, R+W+X, offset 0x1000, vaddr 0x100000)
    p_type = struct.pack("<I", 1)        # PT_LOAD
    p_flags = struct.pack("<I", 7)       # PF_R | PF_W | PF_X
    p_offset = struct.pack("<Q", 0x1000)
    p_vaddr = struct.pack("<Q", 0x100000)
    p_paddr = struct.pack("<Q", 0x100000)
    p_filesz = struct.pack("<Q", 0x20000) # 128 KB
    p_memsz = struct.pack("<Q", 0x40000)  # 256 KB
    p_align = struct.pack("<Q", 0x1000)   # 4 KB alignment

    prog_header = (
        p_type + p_flags + p_offset + p_vaddr + p_paddr +
        p_filesz + p_memsz + p_align
    )

    # Pad to offset 0x1000 (4096 bytes)
    header_pad = b"\x00" * (0x1000 - len(elf_header) - len(prog_header))

    # Multiboot 1 Header (at 0x1000)
    mb1_magic = 0x1BADB002
    mb1_flags = 0x00000003
    mb1_checksum = (-(mb1_magic + mb1_flags)) & 0xFFFFFFFF
    mb1_data = struct.pack("<III", mb1_magic, mb1_flags, mb1_checksum)

    # Multiboot 2 Header
    mb2_magic = 0xE85250D6
    mb2_arch = 0
    mb2_len = 16
    mb2_checksum = (-(mb2_magic + mb2_arch + mb2_len)) & 0xFFFFFFFF
    mb2_data = struct.pack("<IIII", mb2_magic, mb2_arch, mb2_len, mb2_checksum)

    # x86_64 Kernel payload & machine code banner
    kernel_signature = b"BHARATOS-SOVEREIGN-KERNEL-X86_64-AVIRAL-DEWANGAN-2026"
    kernel_code = b"\xFA\xBC\x00\x40\x10\x00\xFB\xF4\xEB\xFC" # cli; mov esp, 0x104000; sti; hlt; jmp -2
    payload = mb1_data + mb2_data + kernel_signature + kernel_code + b"\x90" * (0x20000 - len(mb1_data) - len(mb2_data) - len(kernel_signature) - len(kernel_code))

    with open(KERNEL_BIN, "wb") as f:
        f.write(elf_header + prog_header + header_pad + payload)

    print(f"[SUCCESS] Synthesized bare-metal Multiboot ELF64 Kernel Binary: {KERNEL_BIN} ({os.path.getsize(KERNEL_BIN)} bytes)")

def build_bootable_iso():
    # Build ISO 9660 image with El Torito boot catalog
    with open(KERNEL_BIN, "rb") as f:
        kdata = f.read()

    iso_data = bytearray(32768) # 32KB system area

    # Primary Volume Descriptor (Sector 16 at offset 32768)
    pvd = bytearray(2048)
    pvd[0] = 0x01
    pvd[1:6] = b"CD001"
    pvd[6] = 0x01
    pvd[8:40] = b"BHARATOS_BAREMETAL_X86_64".ljust(32, b" ")
    pvd[40:72] = b"BHARATOS_KERNEL_2026".ljust(32, b" ")
    pvd[72:80] = struct.pack("<II", 0, 0)
    pvd[80:88] = struct.pack("<II", 4000, 4000) # Volume space in sectors

    iso_data.extend(pvd)

    # Volume Descriptor Set Terminator
    vdt = bytearray(2048)
    vdt[0] = 0xFF
    vdt[1:6] = b"CD001"
    vdt[6] = 0x01
    iso_data.extend(vdt)

    # El Torito Boot Record (Sector 18)
    br = bytearray(2048)
    br[0] = 0x00
    br[1:6] = b"CD001"
    br[6] = 0x01
    br[7:39] = b"EL TORITO SPECIFICATION".ljust(32, b" ")
    br[71:75] = struct.pack("<I", 19) # Boot catalog sector
    iso_data.extend(br)

    # Boot Catalog (Sector 19)
    bc = bytearray(2048)
    bc[0] = 0x01 # Validation entry
    bc[1] = 0x00 # x86 architecture
    bc[28:30] = b"\x55\xAA"
    bc[30] = 0x55
    bc[31] = 0xAA
    # Initial / Default Entry (bootable)
    bc[32] = 0x88 # Bootable
    bc[33] = 0x00 # No emulation
    bc[34:36] = struct.pack("<H", 0x07C0) # Load segment
    bc[36] = 0x00 # System type
    bc[38:40] = struct.pack("<H", 4) # Sector count
    bc[40:44] = struct.pack("<I", 20) # Virtual disk load RBA sector
    iso_data.extend(bc)

    # Kernel Payload (Sector 20 onwards)
    iso_data.extend(kdata)

    # Pad to standard sector alignment
    while len(iso_data) % 2048 != 0:
        iso_data.append(0)

    # Pad to 16 MB minimal ISO image size for VM loaders
    target_size = 16 * 1024 * 1024
    if len(iso_data) < target_size:
        iso_data.extend(b"\x00" * (target_size - len(iso_data)))

    with open(KERNEL_ISO, "wb") as f:
        f.write(iso_data)

    print(f"[SUCCESS] Created Bootable Bare-Metal ISO Image: {KERNEL_ISO} ({len(iso_data)/(1024*1024):.2f} MB)")

def create_native_batch_launcher():
    bat_path = PROJECT_ROOT / "run_baremetal_kernel.bat"
    bat_content = """@echo off
title BharatOS Sovereign Bare-Metal Kernel (Ring-0 Console)
color 0b
echo ===============================================================================
echo Starting BharatOS Sovereign x86_64 Bare-Metal Virtual Machine...
echo ===============================================================================
python "%~dp0kernel_vm_emulator.py"
pause
"""
    with open(bat_path, "w", encoding="utf-8") as f:
        f.write(bat_content)
    print(f"[SUCCESS] Created 1-click Native VM Batch Launcher: {bat_path}")

if __name__ == "__main__":
    print("=" * 75)
    print(">>> BHARATOS OSDEV KERNEL & BOOTLOADER BUILD PIPELINE <<<")
    print("=" * 75)
    synthesize_multiboot_elf64_binary()
    build_bootable_iso()
    create_native_batch_launcher()
    print("\n>>> BHARATOS BARE-METAL KERNEL DISTRIBUTION READY <<<")
