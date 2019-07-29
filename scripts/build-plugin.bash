echo "Running plugin build script"
cd react-app && \
yarn install --no-lockfile --cache-folder=".yarn-cache" && \
echo "✓ dependencies installed successfully" && \
yarn build && \
echo "✓ built successfully" && \
yarn test --watchAll=false && \
echo "✓ tests run successfully" && \
yarn install-plugin && \
echo "✓ plugin setup successfully" && \
echo "✓ plugin installed successfully"