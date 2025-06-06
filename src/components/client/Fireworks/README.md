# Fireworks Display Components

This set of components provides celebratory visual effects for success moments in the application.

## Components Available

1. **FireworksDisplay** (index.tsx)

   - Uses the `fireworks-js` library
   - Provides full-screen particle fireworks effect

2. **CustomFireworks** (CustomFireworks.tsx)

   - React-based implementation of fireworks
   - Uses React state and inline styles

3. **ConfettiEffect** (ConfettiEffect.tsx)

   - Uses `confetti-js` library
   - Creates falling confetti particles

4. **Celebration** (Celebration.tsx)

   - Adds subtle sparkles and a background animation
   - Lightweight alternative to heavier effects

5. **FireworksCombination** (FireworksCombination.jsx)
   - Combines multiple effects in one component
   - Includes sound effects and animation

## Usage

### Basic Implementation

Import the components in your page and use them with conditional rendering:

```jsx
import FireworksDisplay from '@/components/client/Fireworks';
import CustomFireworks from '@/components/client/Fireworks/CustomFireworks';
import ConfettiEffect from '@/components/client/Fireworks/ConfettiEffect';
import Celebration from '@/components/client/Fireworks/Celebration';

// In your component
const [showCelebration, setShowCelebration] = useState(false);

// Trigger celebration
const triggerCelebration = () => {
  setShowCelebration(true);

  // Auto-hide after duration
  setTimeout(() => {
    setShowCelebration(false);
  }, 5000);
};

// In your JSX
return (
  <>
    <FireworksDisplay
      show={showCelebration}
      duration={5000}
      onComplete={() => console.log('Fireworks complete')}
    />

    {/* Optional: Add more celebration effects */}
    <CustomFireworks show={showCelebration} duration={5000} />

    <ConfettiEffect show={showCelebration} duration={5000} />
  </>
);
```

### URL Parameter Trigger

In the Learning component, fireworks are triggered by a URL parameter:

```jsx
const searchParams = useSearchParams();
const typeParam = searchParams.get('payment');

useEffect(() => {
  if (typeParam === 'success') {
    setShowFireworks(true);

    // Reset URL to prevent retriggering on refresh
    const newUrl = window.location.pathname;
    router.replace(newUrl);
  }
}, [typeParam, router]);
```

## Troubleshooting

If fireworks display is not visible:

1. Check z-index values - ensure the fireworks containers have higher z-index than other page elements
2. Verify that the state variable (`showFireworks`) is correctly toggled
3. Look for the debug indicators - each component displays a colored indicator when active
4. Check browser console for any error messages
5. Make sure the container has sufficient width/height (should be 100% of viewport)

## Customization

Each component accepts these common props:

- `show`: Boolean to control visibility
- `duration`: Time in milliseconds before auto-hiding
- `onComplete`: Callback function when animation completes

## Implementation Notes

For best results:

- Combine multiple effects for a more dramatic celebration
- Add celebratory sound effects (success.mp3)
- Reset URL parameters to prevent retriggering on page refresh
- Use z-index properly to ensure visibility
