# Deno Deploy Playgrounds

Playgrounds provide a web-based development environment that lets you create, edit, and deploy applications directly in your browser without any local setup or Git repositories.

## Getting Started

### Creating Your First Playground

1. Navigate to your organization's playground section: `/{org}/~/playgrounds`
2. Click **"New Playground"**
3. Choose from available templates:
   - **Hello World** - Basic Deno server with HTTP handling
   - **Hono** - Web framework for building fast APIs
   - **Next.js** - React-based full-stack framework

Your playground will be created instantly with template files ready for editing.

### The Playground Interface

The playground editor features a multi-panel layout:

- **Left Panel**: File explorer for navigation and file management
- **Center Panel**: Monaco code editor with syntax highlighting and IntelliSense
- **Right Panel**: Live preview iframe and HTTP explorer
- **Bottom Panel**: Build logs and deployment status

All panels are resizable and can be collapsed/expanded as needed.

## Core Features

### Code Editing

- **Full-featured Editor**: Monaco editor with TypeScript support, syntax highlighting, and auto-completion
- **Multi-file Support**: Edit multiple files with tab-based navigation
- **Auto-save**: Changes are automatically saved as you type
- **IntelliSense**: Smart code completion and error detection

### File Management

- **Create Files**: Add new files and folders through the file explorer
- **Rename/Delete**: Right-click context menu for file operations
- **File Navigation**: Click any file in the explorer to open it in the editor
- **Folder Organization**: Create nested folder structures for better project organization

### One-Click Deployment

- **Deploy Button**: Deploy your changes instantly from the editor
- **Real-time Logs**: Watch build output and deployment progress in real-time
- **Live Preview**: See your deployed application immediately in the preview panel
- **Deployment History**: Track all deployments with full revision history

### Environment Management

- **Environment Variables**: Configure app-specific environment variables
- **Build Settings**: Customize build configuration and framework presets
- **Multiple Contexts**: Deploy to different environments (Production, Preview)

## Working with Templates

### Hello World Template
```typescript
// Basic Deno server
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve((req: Request) => {
  return new Response("Hello, World!");
});
```

### Hono Template
```typescript
// Web framework example
import { Hono } from 'npm:hono@^3.12.0';

const app = new Hono();

app.get('/', (c) => c.text('Hello Hono!'));
app.get('/api/hello', (c) => c.json({ message: 'Hello API!' }));

export default app;
```

### Next.js Template
Full Next.js application with:
- React components
- API routes
- CSS styling
- TypeScript configuration

## Deployment Process

1. **Make Changes**: Edit your code in the Monaco editor
2. **Preview**: Use the preview panel to test your changes
3. **Deploy**: Click the "Deploy" button when ready
4. **Monitor**: Watch build logs for any issues
5. **Access**: Your app is live at the provided URL

## Key Benefits

- **No Local Setup**: Develop entirely in your browser
- **Instant Deployment**: Deploy with a single click
- **Professional Tools**: Enterprise-grade code editor and debugging
- **Full Platform Integration**: Access to all Deno Deploy features
- **Template-based**: Quick start with proven configurations
- **Collaborative**: Share playground URLs for easy collaboration

## Best Practices

### File Organization
- Use folders to organize related files
- Keep configuration files at the root level
- Group components, utilities, and assets in separate directories

### Development Workflow
1. Start with a template that matches your needs
2. Make incremental changes and test frequently
3. Use the preview panel to verify functionality
4. Deploy only when features are working correctly
5. Monitor build logs for any deployment issues

### Performance Tips
- Use auto-save to prevent losing changes
- Collapse unused panels to maximize editor space
- Use keyboard shortcuts for faster file navigation
- Leverage IntelliSense for better code quality

## Limitations

- Playgrounds are designed for prototyping and small applications
- For production applications, consider using Git integration
- File storage is separate from Git repositories
- Large file uploads may have size restrictions

## Getting Help

If you encounter issues with playgrounds:
- Check the build logs panel for error messages
- Verify your code syntax and imports
- Ensure environment variables are properly configured
- Try redeploying if the deployment appears stuck

Playgrounds make it easy to experiment with Deno and deploy applications quickly, perfect for learning, prototyping, and sharing ideas with others.