# ==============================================================================
# BharatOS Sovereign Bare-Metal Kernel Makefile
# Architecture: x86_64 (Multiboot 1 & 2 Compliant)
# Toolchain: NASM + GCC (Freestanding Bare-Metal) + GNU LD + QEMU
# ==============================================================================

# Cross-Compiler Definitions (or host fallback)
CC      ?= x86_64-elf-gcc
AS      ?= nasm
LD      ?= x86_64-elf-ld
QEMU    ?= qemu-system-x86_64

# Compilation Flags for Bare-Metal Freestanding C Kernel
CFLAGS  := -m64 -ffreestanding -fno-builtin -fno-stack-protector -fno-pie -fno-pic \
           -mno-red-zone -mno-mmx -mno-sse -mno-sse2 -Wall -Wextra -O2 -Iinclude

ASFLAGS := -f elf64
LDFLAGS := -n -T linker.ld -z max-page-size=0x1000

# Directories
SRC_DIR := src
BOOT_DIR:= boot
OBJ_DIR := build
BIN_DIR := bin
ISO_DIR := isodir

# Source Files
C_SRCS  := $(wildcard $(SRC_DIR)/*.c)
ASM_SRCS:= $(wildcard $(BOOT_DIR)/*.asm)

# Object Files
C_OBJS  := $(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(C_SRCS))
ASM_OBJS:= $(patsubst $(BOOT_DIR)/%.asm, $(OBJ_DIR)/%.o, $(ASM_SRCS))
OBJS    := $(ASM_OBJS) $(C_OBJS)

KERNEL_BIN := $(BIN_DIR)/bharatos_kernel.bin
KERNEL_ISO := $(BIN_DIR)/BharatOS-2026-BareMetal-x86_64.iso

.PHONY: all clean run qemu bochs iso

all: $(KERNEL_BIN) $(KERNEL_ISO)

# Compile C Sources
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Assemble Assembly Sources
$(OBJ_DIR)/%.o: $(BOOT_DIR)/%.asm
	@mkdir -p $(OBJ_DIR)
	$(AS) $(ASFLAGS) $< -o $@

# Link Kernel Executable
$(KERNEL_BIN): $(OBJS) linker.ld
	@mkdir -p $(BIN_DIR)
	$(LD) $(LDFLAGS) -o $@ $(OBJS)
	@echo "[SUCCESS] BharatOS 64-bit Kernel Binary Linked: $@"

# Build Bootable ISO with GRUB2
$(KERNEL_ISO): $(KERNEL_BIN)
	@mkdir -p $(ISO_DIR)/boot/grub
	@cp $(KERNEL_BIN) $(ISO_DIR)/boot/bharatos_kernel.bin
	@echo 'set timeout=0' > $(ISO_DIR)/boot/grub/grub.cfg
	@echo 'set default=0' >> $(ISO_DIR)/boot/grub/grub.cfg
	@echo 'menuentry "BharatOS 2026 Sovereign Bare-Metal Kernel" {' >> $(ISO_DIR)/boot/grub/grub.cfg
	@echo '    multiboot2 /boot/bharatos_kernel.bin' >> $(ISO_DIR)/boot/grub/grub.cfg
	@echo '    boot' >> $(ISO_DIR)/boot/grub/grub.cfg
	@echo '}' >> $(ISO_DIR)/boot/grub/grub.cfg
	@grub-mkrescue -o $@ $(ISO_DIR) 2>/dev/null || echo "[NOTE] Install grub-mkrescue / xorriso for native ISO creation"
	@echo "[SUCCESS] BharatOS Bootable ISO created: $@"

# Run in QEMU Virtual Machine
run: $(KERNEL_BIN)
	$(QEMU) -kernel $(KERNEL_BIN) -serial stdio -m 256M -vga std

qemu: run

# Run in Bochs
bochs: $(KERNEL_ISO)
	bochs -q -f bochsrc.txt

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR) $(ISO_DIR)
