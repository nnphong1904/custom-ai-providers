# Contributing Guide

Thank you for considering contributing to our project! We welcome contributions from the community and are excited to see what you will bring to the table.

## How to Contribute

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page to create a copy of the repository in your GitHub account.

2. **Clone your fork**: Use the following command to clone your forked repository to your local machine.
   ```bash
   git clone https://github.com/your-username/custom-ai-providers.git
   ```

3. **Create a new branch**: Create a new branch for your feature or bugfix.
   ```bash
   git checkout -b my-feature-branch
   ```

4. **Make your changes**: Implement your feature or fix the bug. Ensure your code follows the project's coding standards and includes appropriate tests.

5. **Commit your changes**: Commit your changes with a clear and descriptive commit message.
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

6. **Push to your fork**: Push your changes to your forked repository.
   ```bash
   git push origin my-feature-branch
   ```

7. **Create a pull request**: Go to the original repository and create a pull request from your forked repository. Provide a clear description of your changes and any relevant information.


## Development Setup

To set up the development environment, follow these steps:

1. **Install dependencies**: Install the necessary dependencies using npm.
   ```bash
   npm install
   ```

2. **Build the library**: Build the library to ensure everything is working correctly.
   ```bash
   npm run build
   ```

3. **Run dev**: Run the development server to verify your changes.
   ```bash
   npm run dev
   ```
## Adding New Providers

To add a new provider, follow these steps:

1. **Create a new provider file**: Create a new file in `lib/ai-providers/[provider-name]/index.tsx`.

2. **Implement the required interface**: Implement the required interface for the new provider.
   ```typescript
   const provider = {
     information: AIProviderInformation;
     getModels?: (apiKey: string) => Promise<Model[]>;
     buildDefaultHeaders: (apiKey: string) => Array<{ id: string; key: string; value: string }>;
   };
   ```

3. **Add the provider to the index**: Add the new provider to `lib/ai-providers/index.ts`.
   ```typescript
   import { newProvider } from "@/ai-providers/new-provider";

   export const providers = {
     ...,
     [newProvider.information.id]: newProvider,
   };
   ```

## Reporting Issues

If you find any bugs or have any suggestions, please open an issue on GitHub. Provide as much detail as possible to help us understand and address the issue.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

Thank you for your contributions!
