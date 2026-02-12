# Viktron Professional Design System
## Linear.app & Apple.com Inspired

### Design Philosophy
- **Simplicity First**: Clean, minimal interfaces
- **Professional Elegance**: Sophisticated use of whitespace
- **Accessibility**: WCAG 2.1 AAA compliant
- **Performance**: Fast, smooth interactions
- **Modular**: Reusable component library

---

## Color Palette

### Light Mode (Primary)
```css
--background: #ffffff
--surface: #f9fafb
--border: #e5e7eb
--foreground: #111827
--text-secondary: #6b7280
--text-muted: #9ca3af
```

### Dark Mode
```css
--background: #0f172a
--surface: #1e293b
--border: #334155
--foreground: #f8fafc
--text-secondary: #cbd5e1
--text-muted: #94a3b8
```

### Accent Colors
```css
--primary: #3b82f6 (Blue - primary actions)
--secondary: #8b5cf6 (Purple - secondary actions)
--success: #10b981 (Green - success states)
--warning: #f59e0b (Amber - warnings)
--error: #ef4444 (Red - errors)
```

---

## Typography

### Font Stack
- Display: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui
- Body: Same as above
- Mono: "SF Mono", "Monaco", "Cascadia Code", monospace

### Sizes
- **H1**: 48px / 3rem (font-weight: 700)
- **H2**: 36px / 2.25rem (font-weight: 700)
- **H3**: 28px / 1.75rem (font-weight: 600)
- **H4**: 24px / 1.5rem (font-weight: 600)
- **Body Large**: 16px / 1rem (font-weight: 400)
- **Body**: 14px / 0.875rem (font-weight: 400)
- **Caption**: 12px / 0.75rem (font-weight: 500)

---

## Spacing Scale
- 4px (xs)
- 8px (sm)
- 12px (md)
- 16px (lg)
- 24px (xl)
- 32px (2xl)
- 48px (3xl)
- 64px (4xl)

---

## Border Radius
- Buttons/Inputs: 6px
- Cards: 8px
- Modals: 12px
- Avatars: 50%

---

## Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## Component Patterns

### Buttons
- Primary: Solid background, no border
- Secondary: Light background with subtle border
- Tertiary: Text only with hover underline
- States: Default, Hover, Active, Disabled, Loading

### Cards
- No glass effect
- Clean border + subtle shadow
- 8-12px padding
- Hover: Slight scale + shadow increase

### Inputs
- Clean border, no glass
- Focus: Blue border + subtle background change
- Placeholder: Light gray text
- Error: Red border + error message

### Navigation
- Clean, minimal design
- Subtle hover effects
- Active state with underline or pill background

---

## Animations
- Transitions: 150-200ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- No bloat animations - only purposeful motion

---

## Dark Mode Support
All components support light/dark mode via CSS variables
