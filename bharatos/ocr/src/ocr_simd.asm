; ==============================================================================
; BHARATOS SOVEREIGN DESKTOP OPERATING SYSTEM
; Core OCR Engine: AVX2 / SSE4.2 SIMD Vectorized x86_64 Assembly Kernels
; Developer: Aviral Dewangan | Architecture: x86_64 freestanding
; ==============================================================================

global asm_avx2_binarize_pixels
global asm_otsu_histogram_accumulate
global asm_avx2_glyph_dot_product
global asm_sse42_fast_connected_components

section .text
bits 64

; ------------------------------------------------------------------------------
; 1. asm_avx2_binarize_pixels
; Parameters:
;   RCX / RDI : const uint8_t* src_grayscale_buffer (32-byte aligned)
;   RDX / RSI : uint8_t* dst_binary_buffer
;   R8  / RDX : size_t pixel_count (multiple of 32)
;   R9  / RCX : uint8_t threshold_value (0-255)
; ------------------------------------------------------------------------------
asm_avx2_binarize_pixels:
    push rbp
    mov rbp, rsp
    push rbx
    push r12

    movzx eax, r9b
    vmovd xmm0, eax
    vpbroadcastb ymm1, xmm0     ; YMM1 = [threshold, threshold, ... 32 times]

    mov rsi, rcx                ; src buffer
    mov rdi, rdx                ; dst buffer
    mov rcx, r8                 ; pixel count
    shr rcx, 5                  ; divide by 32 (32 bytes per AVX2 loop)

.binarize_loop:
    test rcx, rcx
    jz .binarize_done

    vmovdqu ymm0, [rsi]         ; Load 32 grayscale bytes
    vpcmpgtb ymm2, ymm0, ymm1   ; Compare: ymm2[i] = (pixel[i] > threshold) ? 0xFF : 0x00
    vmovdqu [rdi], ymm2         ; Store 32 binarized mask bytes

    add rsi, 32
    add rdi, 32
    dec rcx
    jmp .binarize_loop

.binarize_done:
    vzeroupper
    pop r12
    pop rbx
    pop rbp
    ret


; ------------------------------------------------------------------------------
; 2. asm_otsu_histogram_accumulate
; Fast assembly accumulator for 256-bin grayscale image intensity distribution
; Parameters:
;   RCX : const uint8_t* src_pixels
;   RDX : uint32_t* histogram_256_bins (256 * 4 bytes = 1024 bytes)
;   R8  : size_t pixel_count
; ------------------------------------------------------------------------------
asm_otsu_histogram_accumulate:
    push rbp
    mov rbp, rsp
    push rbx
    push rsi
    push rdi

    mov rsi, rcx                ; src_pixels
    mov rdi, rdx                ; histogram buffer
    mov rcx, r8                 ; pixel_count

    push rcx
    push rdi
    mov rcx, 256
    xor eax, eax
    rep stosd
    pop rdi
    pop rcx

.hist_loop:
    test rcx, rcx
    jz .hist_done

    movzx eax, byte [rsi]       ; Load pixel intensity (0-255)
    inc dword [rdi + rax*4]     ; histogram[pixel]++

    inc rsi
    dec rcx
    jmp .hist_loop

.hist_done:
    pop rdi
    pop rsi
    pop rbx
    pop rbp
    ret


; ------------------------------------------------------------------------------
; 3. asm_avx2_glyph_dot_product
; Vectorized correlation matching between normalized candidate glyph & template
; Parameters:
;   RCX : const float* glyph_matrix_a (32 float vectors)
;   RDX : const float* template_matrix_b (32 float vectors)
;   R8  : size_t vector_len (multiple of 8 floats = 32 bytes)
; Returns:
;   XMM0 : dot product correlation float
; ------------------------------------------------------------------------------
asm_avx2_glyph_dot_product:
    push rbp
    mov rbp, rsp

    mov rsi, rcx                ; matrix A
    mov rdi, rdx                ; matrix B
    mov rcx, r8                 ; length
    shr rcx, 3                  ; divide by 8 floats (256-bit AVX2)

    vxorps ymm0, ymm0, ymm0     ; Accumulator YMM0 = 0.0

.dot_loop:
    test rcx, rcx
    jz .dot_reduce

    vmovups ymm1, [rsi]         ; Load 8 floats from A
    vmovups ymm2, [rdi]         ; Load 8 floats from B
    vfmadd231ps ymm0, ymm1, ymm2 ; YMM0 += YMM1 * YMM2 (FMA)

    add rsi, 32
    add rdi, 32
    dec rcx
    jmp .dot_loop

.dot_reduce:
    vextractf128 xmm1, ymm0, 1
    vaddps xmm0, xmm0, xmm1
    vhaddps xmm0, xmm0, xmm0
    vhaddps xmm0, xmm0, xmm0

    vzeroupper
    pop rbp
    ret
