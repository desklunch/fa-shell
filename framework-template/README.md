# Layout Framework

A reusable, copy-paste UI framework featuring a responsive sidebar, header, and page layout system. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Fully Responsive** - Mobile overlay, tablet hover behavior, desktop collapsible sidebar
- ✅ **Type-Safe** - Complete TypeScript support with all interfaces exported
- ✅ **Customizable** - Configure navigation, branding, user data, and callbacks
- ✅ **Role-Based Access** - Optional role filtering for navigation items
- ✅ **Stateful** - Sidebar collapse state persists in sessionStorage
- ✅ **Accessible** - ARIA labels and keyboard navigation support
- ✅ **Zero Dependencies on App Logic** - Framework-level components with no app-specific code

## Installation

### 1. Copy Framework Files

Copy the entire `framework-template/` directory into your project:

```bash
cp -r framework-template/ your-project/src/framework/
```

### 2. Install Required Dependencies

```bash
npm install clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dropdown-menu lucide-react
```

### 3. Configure Tailwind CSS

Ensure your `tailwind.config.ts` includes the framework directory:

```typescript
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/framework/**/*.{js,ts,jsx,tsx}", // Add this line
  ],
  // ... rest of config
}
```

Add these CSS variables to your `globals.css` or `index.css`:

```css
:root {
  --sidebar: hsl(30, 33%, 91%);
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(0, 0%, 0%);
  --primary: hsl(0, 0%, 9%);
  --primary-foreground: hsl(0, 0%, 98%);
  --accent: hsl(60, 100%, 60%);
  --accent-foreground: hsl(0, 0%, 9%);
  --border: hsl(0, 0%, 89%);
  /* Add more as needed */
}
```

## Basic Usage

### 1. Set Up Layout Configuration

Create a configuration file for your app (e.g., `src/config/layout-config.tsx`):

```typescript
import { LayoutConfig } from "@/framework/types";
import { Home, Users, Settings } from "lucide-react";

export const layoutConfig: LayoutConfig = {
  user: {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    fullName: "John Doe",
    role: "Admin",
  },
  
  navigation: [
    {
      // Section without heading = standalone items
      items: [
        { name: "Dashboard", href: "/", icon: Home },
      ]
    },
    {
      heading: "MANAGEMENT",
      items: [
        { name: "Users", href: "/users", icon: Users, allowedRoles: ["Admin"] },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    }
  ],
  
  onSignOut: () => {
    // Your sign out logic
    console.log("Signing out...");
  },
  
  onEditProfile: () => {
    // Navigate to profile page
    window.location.href = "/profile";
  },
  
  onSearch: () => {
    // Open your search modal
    console.log("Opening search...");
  },
  
  searchShortcut: "⌘K", // Optional, defaults to "⌘K"
};
```

### 2. Wrap Your App with LayoutProvider

In your `App.tsx` or root component:

```typescript
import { LayoutProvider } from "@/framework/hooks/layout-context";
import PageLayout from "@/framework/components/page-layout";
import { layoutConfig } from "@/config/layout-config";

function App() {
  return (
    <LayoutProvider config={layoutConfig}>
      <PageLayout>
        {/* Your app content */}
        <YourRoutes />
      </PageLayout>
    </LayoutProvider>
  );
}
```

### 3. Use PageLayout in Individual Pages

For pages with breadcrumbs or action buttons:

```typescript
import PageLayout from "@/framework/components/page-layout";
import { Plus } from "lucide-react";

function UsersPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Users", href: "/users" },
        { label: "All Users" }
      ]}
      actionButton={{
        label: "New User",
        icon: Plus,
        onClick: () => console.log("New user"),
        variant: "default"
      }}
    >
      {/* Page content */}
      <div className="p-6">
        <h1>Users</h1>
      </div>
    </PageLayout>
  );
}
```

## Advanced Configuration

### Custom Logo

Replace the default logo by providing a custom component:

```typescript
import YourLogo from "@/components/your-logo";

export const layoutConfig: LayoutConfig = {
  // ... other config
  logo: <YourLogo />,
};
```

### Navigation with Badges

Add notification badges to navigation items:

```typescript
navigation: [
  {
    heading: "ACTIVITY",
    items: [
      { 
        name: "Notifications", 
        href: "/notifications", 
        icon: Bell,
        badge: 5 // Number badge
      },
      { 
        name: "Messages", 
        href: "/messages", 
        icon: Mail,
        badge: "New" // String badge
      },
    ]
  }
]
```

### Role-Based Navigation

Control who can see navigation items:

```typescript
navigation: [
  {
    heading: "ADMIN",
    items: [
      { 
        name: "Users", 
        href: "/users", 
        icon: Users,
        allowedRoles: ["Admin", "SuperAdmin"] // Only visible to these roles
      },
    ],
    allowedRoles: ["Admin", "SuperAdmin"] // Entire section visibility
  }
]
```

### Custom Header Actions

Inject custom components into the header:

```typescript
function MyPage() {
  return (
    <PageLayout
      customHeaderAction={
        <TicketDialog /> // Your custom component
      }
    >
      {/* Page content */}
    </PageLayout>
  );
}
```

### Sections Without Headings

To create standalone nav items (like Dashboard), use a section without a heading:

```typescript
navigation: [
  {
    // No heading = items render as standalone
    items: [
      { name: "Dashboard", href: "/", icon: Home },
      { name: "Analytics", href: "/analytics", icon: BarChart },
    ]
  },
  {
    heading: "CONTENT",
    items: [
      // These will be grouped under "CONTENT"
    ]
  }
]
```

## TypeScript Types

All types are fully exported:

```typescript
import type {
  LayoutConfig,
  NavItem,
  NavSection,
  LayoutUser,
  Breadcrumb,
  ActionButton,
  PageLayoutProps,
} from "@/framework/types";
```

## Customization

### Styling

The framework uses Tailwind CSS. Customize colors by updating CSS variables:

```css
:root {
  --sidebar: hsl(220, 13%, 18%); /* Dark sidebar */
  --accent: hsl(210, 100%, 50%); /* Blue accent */
}
```

### Component Overrides

All components are copy-pasted into your project, so you can modify them directly:

- `framework/components/sidebar.tsx` - Sidebar behavior and layout
- `framework/components/header.tsx` - Header layout and breadcrumbs
- `framework/components/page-layout.tsx` - Outer wrapper and mobile menu state
- `framework/components/logo.tsx` - Default logo (replace with yours)

### Responsive Breakpoints

The framework uses these breakpoints:

- **Small** (<768px): Mobile overlay menu, full-width
- **Medium** (768px-1024px): Hover-to-expand sidebar (72px collapsed)
- **Large** (≥1024px): Toggleable sidebar (72px/320px)

## Folder Structure

```
framework/
├── components/
│   ├── sidebar.tsx        # Main sidebar with navigation
│   ├── header.tsx         # Header with breadcrumbs
│   ├── page-layout.tsx    # Wrapper component
│   └── logo.tsx           # Default logo (replace)
├── ui/
│   ├── button.tsx         # shadcn Button
│   └── dropdown-menu.tsx  # shadcn DropdownMenu
├── hooks/
│   └── layout-context.tsx # LayoutProvider & useLayout
├── lib/
│   └── utils.ts           # cn() utility
├── types/
│   ├── layout.ts          # All TypeScript interfaces
│   └── index.ts           # Re-exports
└── README.md              # This file
```

## Migration from AgencyOps

If you're copying from the AgencyOps source:

1. **Remove app-specific hooks**: No more `useAuth()`, `useGlobalSearch()`, or `useQuery()`
2. **Pass data via LayoutProvider**: User, navigation, and callbacks are injected via context
3. **Replace hardcoded navigation**: Define your nav structure in `layout-config.tsx`
4. **Remove ticket dialog**: Use `customHeaderAction` prop for app-specific features
5. **Update imports**: All `@/` imports are now relative (`../ui/`, `../lib/`, etc.)

## Examples

### Minimal Setup

```typescript
const config: LayoutConfig = {
  user: null, // Not logged in
  navigation: [
    {
      items: [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/about", icon: Info },
      ]
    }
  ],
};
```

### Full-Featured Setup

```typescript
const config: LayoutConfig = {
  user: {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    role: "Admin",
  },
  navigation: [
    { items: [{ name: "Dashboard", href: "/", icon: Home }] },
    {
      heading: "CONTENT",
      items: [
        { name: "Posts", href: "/posts", icon: FileText },
        { name: "Media", href: "/media", icon: Image },
      ]
    },
    {
      heading: "ADMIN",
      items: [
        { name: "Users", href: "/users", icon: Users, allowedRoles: ["Admin"] },
      ],
      allowedRoles: ["Admin"],
    }
  ],
  onSignOut: () => { /* logout */ },
  onEditProfile: () => { /* navigate */ },
  onSearch: () => { /* open search */ },
  logo: <MyCustomLogo />,
};
```

## License

This is a copy-paste framework - no attribution required. Use it however you want!

## Questions?

This framework was extracted from AgencyOps. Modify it to fit your needs - it's yours now!
