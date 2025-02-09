# AI Provider Integration Library

A flexible and extensible TypeScript library for integrating various AI providers into your application. Currently supports:

- [ ] Azure OpenAI Service
- [ ] Amazon Bedrock
- [ ] Google Generative AI / Vertex AI
- [x] Mistral AI
- [ ] xAI Grok
- [ ] Together.ai
- [ ] Cohere
- [ ] Fireworks AI
- [x] DeepInfra
- [x] DeepSeek
- [x] Perplexity AI
- [x] Open Router
- [x] Hugging Face


## Features

- 📝 Form validation using Zod
- 🎨 Prebuilt UI components
- 📄 Output JSON data

## Installation

```bash
npm install custom-ai-providers
# or
yarn add custom-ai-providers
# or
pnpm add custom-ai-providers
```

## Quick Start

```typescript
import { AIProviders } from 'custom-ai-providers';

function App() {
  const handleSave = (configs) => {
    console.log('Model configurations:', configs);
  };

  return (
    <AIProviders onSave={handleSave} />
  );
}
```

## Provider Configuration

Each provider can be configured with:

- API Key
- Custom Headers
- Body Parameters
- Model Capabilities:
  - Plugin Support
  - Vision Support
  - System Messages
  - Streaming Output

## Components

### AIProviders
Main component that handles provider selection and configuration.

## Types

```typescript
interface ModelConfig {
  title: string;
  description: string;
  iconUrl: string;
  endpoint: string;
  id: string;
  modelID: string;
  apiType: "openai" | "anthropic" | "custom";
  contextLength: number;
  headerRows: Array<{ key: string; value: string }>;
  bodyRows: Array<{ key: string; value: string; type: string }>;
  pluginSupported: boolean;
  visionSupported: boolean;
  systemMessageSupported: boolean;
  streamOutputSupported: boolean;
  skipAPIKey: boolean;
  pricePerMillionTokens?: {
    prompt?: number;
    completion?: number;
  } | null;
}
```

## Adding New Providers

To add a new provider:

1. Create a new provider file in `lib/ai-providers/[provider-name]/index.tsx`
2. Implement the required interface:
   ```typescript
   const provider = {
     information: AIProviderInformation;
     getModels?: (apiKey: string) => Promise<Model[]>;
     buildDefaultHeaders: (apiKey: string) => Array<{ id: string; key: string; value: string }>;
   };
   ```
3. Add the provider to `lib/ai-providers/index.ts`

## Development

```bash
# Install dependencies
npm install

# Build library
npm run build
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

[MIT](LICENSE)
