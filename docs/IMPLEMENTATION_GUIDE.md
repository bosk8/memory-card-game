# Memory Card Game — Implementation Guide
## Quick Reference Guide

**Purpose**: Quick reference for implementing the Bosk8 design system in the Memory Card Game.

---

## Token Quick Reference

### Colors
```css
/* Backgrounds */
--bg-black: #000000        /* Pure black background */
--bg-elev1: #0A0A0A        /* Elevated surface (main background) */
--surface-card: #09090B    /* Card/container background */

/* Text */
--text-primary: #FFFFFF    /* Primary text (white) */
--text-muted: #E8E8E8      /* Muted text (light gray) */
--text-subtle: #A1A1AA     /* Subtle text (medium gray) */
--text-dim: #71717A        /* Dim text (dark gray) */
--text-highlight: #F4F4F5  /* Highlight text (very light) */

/* Accents */
--accent-success: #22C55E  /* Success/green accent */

/* Borders & Shadows */
--border-color: rgb(39 39 42)  /* Border color */
--border-w: 1px               /* Standard border (1.5px ≥1024px) */
--border-outer-w: 1px         /* Outer border (2px ≥1024px) */
--shadow-tint: #0000000d      /* Subtle shadow */
```

### Typography
```css
--font-ui: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, DejaVu Sans Mono, Courier New, monospace;
--fs-base: clamp(16px, calc(15.2px + 0.25vw), 20px);  /* Responsive base */

/* Font Sizes */
fontSize.xs: 0.625rem  /* 10px */
fontSize.sm: 0.75rem   /* 12px */
fontSize.md: 0.875rem  /* 14px */
fontSize.lg: 1rem      /* 16px */

/* Typography Patterns */
.tagline, .meta, .label, .nav {
  font-family: var(--font-ui);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
```

### Spacing
```css
--space-0_5: 0.5rem   /* 8px */
--space-0_75: 0.75rem  /* 12px */
--space-1: 1rem       /* 16px */
--space-1_5: 1.5rem   /* 24px */
--space-2: 2rem       /* 32px */
--space-4: 4rem       /* 64px */
```

### Border Radius
```css
--r-sm: 4px  /* Small radius */
--r-md: 6px  /* Medium radius */
```

---

## Component Patterns

### Card Container
```css
.card {
  background-color: var(--surface-card);
  box-shadow: 0 0 0 var(--border-outer-w) var(--border-color), 0 1px 2px var(--shadow-tint);
  /* Add padding as needed */
}
```

### Button (Primary Control)
```css
button {
  padding: var(--space-0_75) var(--space-1);
  border: var(--border-w) solid var(--border-color);
  border-radius: var(--r-md);
  font-size: 1rem;
  font-family: var(--font-ui);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--surface-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

button:hover {
  color: var(--text-primary);
}

button:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: 2px;
}

button:active {
  transform: translateY(1px);
}
```

### Focus Styles (Universal)
```css
:focus-visible {
  outline: 2px solid var(--border-color);
  outline-offset: 2px;
}
```

### Typography Classes
```css
.tagline {
  font-size: 1rem;
  text-align: center;
  /* Inherits .tagline pattern from style.md */
}

.meta-sm {
  font-size: 0.75rem;
  /* Inherits .meta pattern */
}
```

---

## Responsive Breakpoints

### Desktop Border Enhancement (≥1024px)
```css
@media (min-width: 1024px) {
  :root {
    --border-w: 1.5px;
    --border-outer-w: 2px;
  }
}
```

### Mobile Card Sizing
```css
/* Desktop: 80×80px */
.card {
  width: 80px;
  height: 80px;
}

/* Tablet/Mobile (< 768px): 60×60px */
@media (max-width: 768px) {
  .card {
    width: 60px;
    height: 60px;
  }
}

/* Small Mobile (< 480px): 50×50px */
@media (max-width: 480px) {
  .card {
    width: 50px;
    height: 50px;
  }
}
```

---

## Accessibility Checklist

### Every Interactive Element Must Have:
- [ ] Semantic HTML (`<button>`, `<select>`, etc.)
- [ ] `aria-label` or visible text label
- [ ] Focus visible (2px outline per style.md)
- [ ] Keyboard accessible (Tab, Enter/Space)

### Cards Specifically:
- [ ] `aria-pressed="false|true"` for flip state
- [ ] Dynamic `aria-label` with position and state
- [ ] `tabindex="0"` for keyboard navigation
- [ ] Icon content in `aria-hidden="true"` span

### Modal Specifically:
- [ ] `role="dialog"`
- [ ] `aria-labelledby` pointing to title
- [ ] `aria-hidden="true|false"` for show/hide
- [ ] Focus trap (Tab cycles within modal)
- [ ] Escape key closes modal

---

## Common Pitfalls to Avoid

1. **Don't invent new tokens** — If you need a color/spacing that's not in style.md, derive it from existing tokens and document it in Style Decisions Log.

2. **Don't skip uppercase** — All UI labels/buttons must use `text-transform: uppercase` with `letter-spacing: 0.05em`.

3. **Don't forget responsive borders** — Border widths increase at 1024px breakpoint.

4. **Don't skip focus styles** — Every interactive element needs `:focus-visible` with 2px outline.

5. **Don't use non-monospace fonts** — Stick to `--font-ui` (JetBrains Mono fallback stack).

6. **Don't exceed 200ms transitions** — Per style.md motion rules, keep animations under 200ms.

7. **Don't forget `prefers-reduced-motion`** — Always check and disable animations when user prefers reduced motion.

---

## Testing Checklist

Before marking a component complete:

- [ ] Colors match style.md tokens exactly (use browser dev tools color picker)
- [ ] Typography uses `--font-ui` and correct size tokens
- [ ] Spacing uses `--space-*` tokens
- [ ] Focus styles visible on keyboard navigation
- [ ] Hover states work (but don't rely on them for accessibility)
- [ ] Responsive breakpoints tested (320px, 768px, 1024px, 1920px)
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Keyboard-only navigation works
- [ ] `prefers-reduced-motion` disables animations

---

**See `DESIGN_SYSTEM.md` for complete specifications.**

